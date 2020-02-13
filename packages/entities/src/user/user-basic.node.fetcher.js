import { createFetcher } from '@blast-engine/firework'

export const fetchUserBasic = createFetcher({
  name: 'fetch-user-basic'
}, ({ userId }) => ({
  steps: [{
    name: 'basic',
    requires: [ ],
    query: ({ root }) => 
      root.userBasicRef({ userId }).query()
  }],
  final: {
    take: [],
    instantiate: ({ basic }) => basic
  }
}))