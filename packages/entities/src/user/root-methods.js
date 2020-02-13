import { UserBasic } from './user-basic.node'

export const rootMethods = {

  userBasicRef({ userId }) {
    return this._spinoff(UserBasic.ref(), {
      path: `user_basic/${userId}`
    })
  }

}