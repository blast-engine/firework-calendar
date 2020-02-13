import { createFetcher } from '@blast-engine/firework'

export const fetchEventBasic = createFetcher({
  name: 'fetch-event-basic'
}, ({ calendarId, eventId }) => ({
  steps: [{
    name: 'basic',
    requires: [ ],
    query: ({ root }) => 
      root.eventBasicRef({ calendarId, eventId }).query()
  }],
  final: {
    take: [],
    instantiate: ({ basic }) => basic
  }
}))