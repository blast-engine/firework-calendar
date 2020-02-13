import { createFetcher } from '@blast-engine/firework'

export const fetchCalendarBasicList = createFetcher({
  name: 'fetch-calendar-basic-list'
}, () => ({
  steps: [{
    name: 'calendars',
    query: ({ root }) => root.calendarBasicListRef().query()
  }],
  final: {
    take: [ 'calendars' ],
    instantiate: ({ calendars }) => calendars
  }
}))