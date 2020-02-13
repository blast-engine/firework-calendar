import { createListClass } from '@blast-engine/firework'

import { CalendarBasic } from './calendar-basic.node'

export const CalendarBasicList = createListClass({
  name: 'CalendarBasicList',
  itemModel: CalendarBasic
})