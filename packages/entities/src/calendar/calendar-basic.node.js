import { createNodeClass } from '@blast-engine/firework'

export const CalendarBasic = createNodeClass({
  name: 'CalendarBasic',

  full: class { 
    
    id() {
      return this._data('calendarId')
    }

    calendarId() {
      return this.id()
    }

    name() {
      return this._data('name')
    }

    setName({ name }) {
      return this._update({ name })
    }

    ownerId() {
      return this._data('ownerId')
    }

    setOwnerId({ ownerId }) {
      return this._update({ ownerId })
    }
  },
   
  ref: class {

    initialize({ id, name }) {
      return this._update({ calendarId: id, name })
    }

  }
})