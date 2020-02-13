import { createMixableClass } from '@blast-engine/mixable'
import { Model } from '@blast-engine/firework'

import { user } from './user'
import { event } from './event'
import { calendar } from './calendar'

export const Root = createMixableClass({
  name: 'Root',
  inherits: [ Model ],
  body: class {
    _constructor() {
      Object.assign(this, 
        user.rootMethods,
        event.rootMethods,
        calendar.rootMethods
      )
    }
  }
})