import { merge } from '@blast-engine/utils'
import { uniqueVals, memoized, arrayOfLength, shallowClone } from '../../utils'
import { NUM_QUARTER_HOURS_IN_DAY, QUARTER_HOUR_MS } from './schedule-units.const'

/**
 * @pure
 */
export const computeEventLayoutForDay = ({ day, events, focusedEvent }) => {

  let layoutEvents = filterOutIrrelevantEvents(day, events.asArray())
    .map(event => event.serializableCopy())
  
  // add in the new event if currently being created
  if (focusedEvent) {
    if (!focusedEvent.isNew) layoutEvents = layoutEvents.filter(e => e.id !== focusedEvent.id)
    layoutEvents.push({ ...focusedEvent })
  }

  let group = []
  let verticalRails = 0
  arrayOfLength(NUM_QUARTER_HOURS_IN_DAY).forEach((_, i) => {

    const slotStartTimestamp = day.startTimestamp + (i * QUARTER_HOUR_MS)
    const slotEndTimestamp = slotStartTimestamp + QUARTER_HOUR_MS - 1
    const slot = {
      startTimestamp: slotStartTimestamp,
      endTimestamp: slotEndTimestamp
    }

    // find all events that are present in this slot
    const concurrentEventsForSlot = layoutEvents
      .filter(e => (
        (e.startTimestamp >= slot.startTimestamp && e.startTimestamp <= slot.endTimestamp) ||
        (e.endTimestamp >= slot.startTimestamp && e.endTimestamp <= slot.endTimestamp) ||
        (e.startTimestamp < slot.startTimestamp && e.endTimestamp > slot.endTimestamp)
      ))
    
    if (concurrentEventsForSlot.every(e => !group.includes(e))) {
      verticalRails = 0
      group = concurrentEventsForSlot
    } else {
      group = uniqueVals([ ...group, ...concurrentEventsForSlot ])
    }

    verticalRails = Math.max(verticalRails, concurrentEventsForSlot.length)

    const getNextHorizontalIndex = ({ otherConcurrentEvents }) => {
      const usedHIndexes = otherConcurrentEvents
        .map(e => e.horizontalIndex)
        .filter(hi => hi !== undefined)

      let hIndex = undefined
      let nextHIndexAttempt = 0
      while (hIndex === undefined) {
        const attempt = nextHIndexAttempt++
        if (!usedHIndexes.includes(attempt)) hIndex = attempt
      }

      return hIndex
    }

    group.forEach(e => e.concurrentEventCount = verticalRails)
    concurrentEventsForSlot.forEach(e => {
      if (e.horizontalIndex === undefined) 
        e.horizontalIndex = getNextHorizontalIndex({ 
          otherConcurrentEvents: concurrentEventsForSlot.filter(ev => ev !== e) 
        })
    })
  })
  
  return layoutEvents
}

/**
 * @pure
 */
const filterOutIrrelevantEvents = memoized((day, events = []) => 
  events.filter(event => (
    (event.endTimestamp() > day.startTimestamp) &&
    (event.startTimestamp() < day.endTimestamp)
  ))
)

