import React, { memo } from 'react'
import classNames from 'classnames/bind'
import { isReady } from '@blast-engine/firework'
import moment from 'moment'

import { getWeekDays, getWeekRange } from '../../utils'
import { DaySchedule } from '../day-schedule'
import styles from './week-schedule.module.scss'
const c = classNames.bind(styles)

export const WeekSchedule = memo(({ calendar, timestampWithinWeek }) => {

  if (!isReady(calendar)) return null

  // --

  const days = getWeekDays(getWeekRange(timestampWithinWeek).from)
    .map(day => ({
      startTimestamp: moment(day).valueOf(),
      endTimestamp: moment(day).endOf('day').valueOf()
    }))

  const formatDayForHeader = ({ startTimestamp }) => 
    moment(startTimestamp).format('dddd Do')

  const savedEvents = calendar.events()

  return (
    <div className={c('container')}>
      <div className={c('schedule-header')}>
        {
          days.map((day, i) => 
            <div key={day.startTimestamp} className={c([
              'column', 'header', days.length === i + 1 ? 'last' : null 
            ])}>
              {formatDayForHeader(day)}
            </div>
          )
        }
      </div>
      <div className={c('schedule-body')}>
        <div className={c('labels')}>
          {
            hourLabels.map(hourLabel => 
              <div 
                key={hourLabel} 
                className={c('label')} 
                data-text={hourLabel}>
              </div>
            )              
          }
        </div>
        <div className={c('content')}>
          <div className={c('lines')}>
            {
              hourLabels.map(hourLabel => 
                <div 
                  key={hourLabel} 
                  className={c('line')}>
                </div>
              )              
            }
          </div>
          {
            days.map((day, i) => 
              <div key={i} className={c(['column', days.length === i + 1 ? 'last' : null ])}>
                <DaySchedule
                  key={i}
                  config={{ quarterHourHeight: 10 }}
                  day={day}
                  events={savedEvents}
                />
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
})

const hourLabels = [
  '12am', '1am', '2am', '3am', '4am', '5am', '6am',
  '7am', '8am', '9am', '10am', '11am', '12pm', '1pm',
  '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm',
  '9pm', '10pm', '11pm'
]
