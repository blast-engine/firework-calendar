import { createAssemblyClass } from '@blast-engine/firework'

import { CalendarBasic } from './calendar-basic.node'
import { EventBasicList } from '../event/event-basic.list'

export const CalendarFull = createAssemblyClass({
  name: 'CalendarFull',
  memberModels: {
    basic: CalendarBasic,
    events: EventBasicList
  },
  portMethods: {
    basic: [
      'name',
      'setName'
    ]
  },
  body: class {

    events() {
      return this.members.events
    }

  }
})