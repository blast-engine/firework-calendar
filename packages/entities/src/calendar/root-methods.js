import { CalendarBasic } from './calendar-basic.node'
import { CalendarBasicList } from './calendar-basic.list'

export const rootMethods = {

  calendarBasicRef({ calendarId }) {
    return this._spinoff(CalendarBasic.ref(), {
      path: `calendar_basic/${calendarId}`
    })
  },

  calendarBasicListRef() {
    return this._spinoff(CalendarBasicList.ref(), {
      path: `calendar_basic`
    })
  }

}