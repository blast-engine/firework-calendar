import { createNodeClass } from '@blast-engine/firework'

export const EventBasic = createNodeClass({
  name: 'EventBasic',

  full: class { 
    
    id() {
      return this._data('eventId')
    }

    serializableCopy() {
      return {
        id: this.id(),
        name: this.name(),
        startTimestamp: this.startTimestamp(),
        endTimestamp: this.endTimestamp()
      }
    }

    eventId() {
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

    startTimestamp() {
      return this._data('startTimestamp')
    }

    setStartTimestamp({ startTimestamp }) {
      return this._update({ startTimestamp })
    }

    endTimestamp() {
      return this._data('endTimestamp')
    }
    
    setEndTimestamp({ endTimestamp }) {
      return this._update({ endTimestamp })
    }

  },
   
  ref: class {

    initialize({ id, name, startTimestamp, endTimestamp }) {
      return this._update({ eventId: id, name, startTimestamp, endTimestamp })
    }

  }
})