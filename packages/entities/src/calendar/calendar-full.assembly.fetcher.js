import { createFetcher } from '@blast-engine/firework'

import { CalendarBasic } from './calendar-basic.node'
import { EventBasicList } from '../event/event-basic.list'
import { CalendarFull } from './calendar-full.assembly'

export const fetchCalendarFull = createFetcher({
  name: 'fetch-calendar-full'
}, ({ calendarId }) => ({
  steps: [{
    name: 'calendarBasic',
    query: ({ root }) => root.calendarBasicRef({ calendarId }).query()
  }, {
    name: 'eventBasicList',
    query: ({ root }) => {
      return root.eventBasicListRef({ calendarId }).query()
    }
  }],
  final: {
    take: [ 'calendarBasic', 'eventBasicList' ],
    instantiate: ({ calendarBasic, eventBasicList, root }) => 
      root._spinoff(CalendarFull, {
        members: {
          basic: calendarBasic,
          events: eventBasicList
        }
      })
  }
}))