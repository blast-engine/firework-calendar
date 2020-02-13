import { CalendarBasic } from './calendar-basic.node'
import { fetchCalendarBasic } from './calendar-basic.node.fetcher'
import { CalendarBasicList } from './calendar-basic.list'
import { fetchCalendarBasicList } from './calendar-basic.list.fetcher'
import { CalendarFull } from './calendar-full.assembly'
import { fetchCalendarFull } from './calendar-full.assembly.fetcher'
import { rootMethods } from './root-methods'

export const calendar = { 
  CalendarBasic, 
  fetchCalendarBasic,
  CalendarBasicList,
  fetchCalendarBasicList,
  CalendarFull,
  fetchCalendarFull,
  rootMethods
}