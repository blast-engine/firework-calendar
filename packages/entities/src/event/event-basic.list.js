import { createNodeClass } from '@blast-engine/firework'
import { keys } from '@blast-engine/utils'

import { EventBasic } from './event-basic.node'

export const EventBasicList = createNodeClass({
  name: 'EventBasicList',

  full: class {

    item(key) {
      return this._spinoff(EventBasic.full(), {
        path: this._path([ key ]),
        data: this._data(key) 
      })
    }

    add({ initArgs, newItemId }) {
      if (!newItemId) newItemId = this.newKey()
      const newItemRef = this._spinoff(EventBasic.ref(), { path: this._path([ newItemId ]) })
      return [
        this._update({ _: true }),
        newItemRef.initialize({ id: newItemId, ...initArgs })
      ]
    }
    
    remove(eventId) {
      return this._update({ [eventId]: null })
    }

    asArray() {
      return keys(this._data())
        .filter(k => k !== '_')
        .map(k => this.item(k))
    }    
    
    newKey() {
      return this._fb.newKey(this._strPath())
    }

  }

})