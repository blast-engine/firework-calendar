import { createNodeClass } from '@blast-engine/firework'

export const UserBasic = createNodeClass({
  name: 'UserBasic',

  full: class { 
    
    setUsername({ username }) {
      return this._update({ username })
    }

  },
   
  ref: class {

    initialize({ id, username }) {
      return this._update({ userId: id, username })
    }

  },
  
  struct: class {

    id() {
      return this._data('userId')
    }

    userId() {
      return this.id()
    }
    
  }
})