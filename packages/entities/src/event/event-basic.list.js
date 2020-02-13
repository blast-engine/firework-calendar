import { createListClass } from '@blast-engine/firework'

import { EventBasic } from './event-basic.node'

export const EventBasicList = createListClass({
  name: 'EventBasicList',
  itemModel: EventBasic
})