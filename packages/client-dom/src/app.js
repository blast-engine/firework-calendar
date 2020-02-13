import React from 'react'
import classNames from 'classnames/bind'
import { responsiveComponent } from '@blast-engine/responsive-component'

import { Calendar } from './calendar'
import styles from './app.module.scss'
const c = classNames.bind(styles)

export const App = responsiveComponent(
  ({ isMobile }) => 
    <div className={c('app')}>
      {
        isMobile 
          ? <h1> mobile not supported</h1>
          : <Calendar calendarId='-M-BdXzW8UCEGPUba8Gf'/> 
      }
    </div>   
)
