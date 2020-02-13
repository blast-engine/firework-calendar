import { set } from '../../../utils'
import * as getters from './getters'
import { INIT_STATE } from './init'

export const closeModal = state => set(state, {
  modalIsOpen: false
})

export const clearFocusedEvent = state =>
  INIT_STATE

export const hideFocusedEvent = state => set(state, {
  hidden: true
})

export const startDraggingExisting = (state, { calEvent, snappedTouchTimestamp, nowTimestamp }) => set(state, {
  focused: true,
  isNew: false,
  isDragging: true,
  startingDragTimestamp: snappedTouchTimestamp,
  currentDragTimestamp: snappedTouchTimestamp, 
  startedToDragAt: nowTimestamp,
  id: calEvent.id,
  name: calEvent.name, 
  // adding each property individually because we dont want to add the display props like horizontalIndex.
  // the display properties should be separated off so these callbacks dont see them
  startTimestamp: calEvent.startTimestamp,
  endTimestamp: calEvent.endTimestamp,
  saved: calEvent
})

export const startDraggingNew = (state, { snappedTouchTimestamp }) => set(state, {
  focused: true,
  id: 'new-event', // @todo: for react key, how should we handle this?
  isNew: true,
  anchor: 'top',
  isDragging: true,
  anchorTimestamp: snappedTouchTimestamp,
  startTimestamp: snappedTouchTimestamp,
  endTimestamp: snappedTouchTimestamp
})

export const stopDraggingNewAndOpenCreateModal = state => set(state, {
  modalIsOpen: true,
  isDragging: false
})

export const cancelDraggingExistingAndOpenEditModal = state => set(state, {
  modalIsOpen: true,
  isDragging: false,
})

export const stopDraggingExisting = () => 
  INIT_STATE

export const moveFocusedEventWithDrag = (state, { snappedTouchTimestamp }) => {
  const delta = snappedTouchTimestamp - state.currentDragTimestamp
  if (!state.isDragging) return state
  return set(state, {
    startTimestamp: state.startTimestamp + delta,
    endTimestamp: state.endTimestamp + delta,
    currentDragTimestamp: state.currentDragTimestamp + delta
  }) 
}

export const extendFocusedEventLengthWithDrag = (state, { snappedTouchTimestamp }) => {
  if (!getters.isDragging(state)) return state

  if (
    [state.startTimestamp, state.endTimestamp]
      .includes(snappedTouchTimestamp)
  ) return state

  if (state.anchorTimestamp > snappedTouchTimestamp) 
    return set(state, { 
      anchor: 'bottom',
      endTimestamp: state.anchorTimestamp,
      startTimestamp: snappedTouchTimestamp 
    })

  else if (state.anchorTimestamp < snappedTouchTimestamp)
    return set(state, { 
      anchor: 'top',
      startTimestamp: state.anchorTimestamp,
      endTimestamp: snappedTouchTimestamp 
    })

  else if (state.anchor === 'bottom')
    return set(state, { 
      startTimestamp: snappedTouchTimestamp 
    })

  else 
    return set(state, { 
      endTimestamp: snappedTouchTimestamp  
    })
}

export const updateFocusedEventName = (state, { newName }) => set(state, {
  name: newName
})