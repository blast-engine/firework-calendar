import { EventBasic } from './event-basic.node'
import { EventBasicList } from './event-basic.list'

export const rootMethods = {

  eventBasicRef({ calendarId, eventId }) {
    return this._spinoff(EventBasic.ref(), {
      path: `event_basic/${calendarId}/${eventId}`
    })
  },

  eventBasicListRef({ calendarId }) {
    return this._spinoff(EventBasicList.ref(), {
      path: `event_basic/${calendarId}`
    })
  }

}