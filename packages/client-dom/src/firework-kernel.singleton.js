import * as firebase from 'firebase'
import { boot, createFireworkConnect, isReady } from '@blast-engine/firework'

import * as entities from '@firework-calendar/entities'

firebase.initializeApp({
  apiKey: "AIzaSyB0RR4vVwhWgh1aZFuyTPpWOvte-ibOu3A",
  authDomain: "firework-calendar.firebaseapp.com",
  databaseURL: "https://firework-calendar.firebaseio.com",
  projectId: "firework-calendar",
  storageBucket: "firework-calendar.appspot.com",
  messagingSenderId: "523131495045",
  appId: "1:523131495045:web:1030a9ef5e6e2e5dc2bfec"
})

export const kernel = boot({ Root: entities.Root, firebase })
export const fireworkConnect = createFireworkConnect({ kernel })

window.kernel = kernel
window.entities = entities
window.isReady = isReady