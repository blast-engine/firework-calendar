import React, { memo, useState, useRef } from 'react'
import classNames from 'classnames/bind'
import moment from 'moment'
import { Modal, Button } from 'antd'

import { absolutePosition, set, get, timestampToLocalTimeOfDay, createContextProvider, createTransitionPerformer, provideContext } from '../../utils'
import { QUARTER_HOUR_MS, NUM_QUARTER_HOURS_IN_DAY} from './schedule-units.const'
import { kernel } from '../../firework-kernel.singleton'
import { computeEventLayoutForDay } from './event-layout.fn'
import { transitions, getters, INIT_STATE } from './state'
import * as actionFnCreators from './day-schedule.actions'
import * as unitConversionFnCreators from './schedule-units.fn'
import styles from './day-schedule.module.scss'
const c = classNames.bind(styles)

const PERCENT_EMPTY_SPACE = 10

/**
 * @props 
 *   - config: {
 *      quarterHourHeight: number
 *   }
 *   - day: {
 *      startTimestamp: number
 *      endTimestamp: number
 *   }
 *   - events: EventList
 */
export const DaySchedule = memo(({ config, day, events, addNewEvent, updateEvent, deleteEvent }) => {

  const [ state, setState ] = useState(INIT_STATE)
  const eventSpaceElement = useRef(null)

  // --

  const performTransition = createTransitionPerformer({ 
    getState: () => state, 
    setState 
  })

  const actions = provideContext(actionFnCreators, { 
    state,
    performTransition,
    addNewEvent,
    updateEvent,
    deleteEvent,
    events,
    kernel
  })

  // --

  const unitConversions = provideContext(unitConversionFnCreators, {
    quarterHourHeight: config.quarterHourHeight, 
    dayStartTimestamp: day.startTimestamp 
  })

  // --

  const getRelativeTouchPosition = (pageY, eventSpaceElement) => 
    pageY - absolutePosition(eventSpaceElement).top

  const deriveSnappedTouchTimestamp = (touchPageYPosition, eventSpaceElement) => {
    const relativeTouchPosition = getRelativeTouchPosition(touchPageYPosition, eventSpaceElement)
    const touchTimestamp = unitConversions.relativePositionToTimestamp(relativeTouchPosition)
    return unitConversions.snapTimestampToQuarterHour(touchTimestamp)
  }

  // --

  const handleModalOk = () =>
    actions.closeModalAndSave()

  const handleModalCancel = () => 
    actions.closeModalAndDoNotSave()
  
  const handleModalDelete = () =>
    actions.closeModalAndDelete()

  const handleMouseDownOnEvent = (domEvent, calEvent) => {
    const snappedTouchTimestamp = 
      deriveSnappedTouchTimestamp(domEvent.pageY, eventSpaceElement.current)
    const nowTimestamp = Date.now()
    actions.startDraggingExisting({ calEvent, snappedTouchTimestamp, nowTimestamp })
  }

  const handleMouseDownOnSpace = (domEvent) => {
    // ignore events not originating from space itself
    if (domEvent.target !== domEvent.currentTarget) return 
    const snappedTouchTimestamp = 
      deriveSnappedTouchTimestamp(domEvent.pageY, eventSpaceElement.current)
    actions.startDraggingNew({ snappedTouchTimestamp })
  } 

  const handleMouseUp = domEvent => {
    if (!getters.isDragging(state)) return
    domEvent.stopPropagation()
    domEvent.preventDefault()
    if (getters.isDraggingNew(state)) 
      actions.stopDraggingNewAndOpenCreateModal()
    else {
      const releaseTimestamp = Date.now()
      if (getters.shouldTreatAsClick(state, { releaseTimestamp }))
        actions.cancelDraggingExistingAndOpenEditModal()
      else actions.stopDraggingExistingAndSave() 
    }
  }

  const handleMouseMove = e => {
    if (!getters.isDragging(state)) return
    e.stopPropagation()
    e.preventDefault()
    const snappedTouchTimestamp = deriveSnappedTouchTimestamp(e.pageY, eventSpaceElement.current)
    if (getters.isDraggingNew(state))  
      actions.extendFocusedEventLengthWithDrag({ snappedTouchTimestamp })
    else actions.moveFocusedEventWithDrag({ snappedTouchTimestamp })
  }

  const handleInputChangeForFocusedEventName = e =>
    actions.updateFocusedEventName(e.target.value)

  const handleMouseLeaveOnSpace = e => {
    if (getters.isDragging(state))
      setState(INIT_STATE)
  }

  const layoutEvents = computeEventLayoutForDay({
    day,
    events,
    focusedEvent: getters.focusedEvent(state)
  })

  const truncatedRelativeStartTimestamp = event => 
    Math.max(0, event.startTimestamp - day.startTimestamp)

  const truncatedLengthTime = event => {
    const MS_IN_DAY = 24 * 60 * 60 * 1000
    const rawRelStartTimestamp = event.startTimestamp - day.startTimestamp
    const truncatedRelStartTimestamp = truncatedRelativeStartTimestamp(event)
    const truncatedStartDelta = truncatedRelStartTimestamp - rawRelStartTimestamp
    const rawLength = event.endTimestamp - event.startTimestamp
    const lengthWithTruncatedStart = rawLength - truncatedStartDelta
    if ((lengthWithTruncatedStart + truncatedRelStartTimestamp) > MS_IN_DAY) 
      return MS_IN_DAY - truncatedRelStartTimestamp
    else return lengthWithTruncatedStart
  }

  // prep data for render
  const displayableEvents = layoutEvents.map(event => ({
    key: event.id, 
    ...event,
    coors: { 
      top: unitConversions.relativeTimestampToYValue(
        truncatedRelativeStartTimestamp(event)
      ),
      height: unitConversions.relativeTimestampToYValue(
        truncatedLengthTime(event)
      )
    }
  }))

  return (
    <div 
      className={c(['day-schedule', getters.isDragging(state) ? 'dragging' : null])} 
      onMouseDown={handleMouseDownOnSpace}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={domEvent => handleMouseLeaveOnSpace(domEvent)}
      style={{ height: config.quarterHourHeight * NUM_QUARTER_HOURS_IN_DAY  }}
      ref={eventSpaceElement}
    >
      {
        displayableEvents.map(ev => 
          <div 
            onMouseDown={domEvent => handleMouseDownOnEvent(domEvent, ev)}
            className={c([ 'event', ev.focused ? 'focused' : 'saved' ])} 
            style={{ 
              ...ev.coors,
              width: `${(100 - PERCENT_EMPTY_SPACE) / ev.concurrentEventCount}%`,
              left: `${((100 - PERCENT_EMPTY_SPACE) / ev.concurrentEventCount) * ev.horizontalIndex}%`
            }}
            key={ev.key}
          >
            <div className={c('header')}>
              <div className={c('left')}>{!ev.isNew ? ev.name : ''}</div>
            </div>
          </div>
        )
      }
      <Modal
        title={getters.modalTitle(state)}
        visible={getters.modalIsVisible(state)}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        footer={[
          (getters.isNew(state)
            ? <Button key='cancel' onClick={handleModalCancel}>Cancel</Button>
            : <Button key='delete' type='danger' onClick={handleModalDelete}>Delete</Button>
          ),
          <Button key='ok' type='primary' onClick={handleModalOk}>Ok</Button>
        ]}
      >
        <input 
          placeholder='name' 
          value={getters.focusedEventName(state)} 
          onChange={handleInputChangeForFocusedEventName}
        />
      </Modal>
    </div>
  )
})