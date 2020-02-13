import { createFetcher } from '@blast-engine/firework'

export const fetchCalendarBasic = createFetcher({
  name: 'fetch-calendar-basic'
}, ({ userId }) => ({
  steps: [{
    name: 'basic',
    requires: [ ],
    query: ({ root }) => 
      root.calendarBasicRef({ userId }).query()
  }],
  final: {
    take: [],
    instantiate: ({ basic }) => basic
  }
}))