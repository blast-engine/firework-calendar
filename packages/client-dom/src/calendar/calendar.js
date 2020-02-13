import React, { memo, useState } from 'react'
import { isReady } from '@blast-engine/firework'
import DayPicker from 'react-day-picker'
import moment from 'moment'

import * as entities from '@firework-calendar/entities'
import { fireworkConnect } from 'firework-kernel.singleton'
import { WeekSchedule } from './week-schedule'
import { getWeekDays, getWeekRange } from '../utils'

export const Calendar =
  fireworkConnect(
    props => ({
      calendar: entities.calendar.fetchCalendarFull({ calendarId: props.calendarId })
    })
  )(memo(({ calendar }) => {

    const [ state, setState ] = useState({ 
      selectedDays: getWeekDays(getWeekRange(new Date()).from) 
    })

    const { hoverRange, selectedDays } = state

    // --

    const handleDayClick = date => 
      setState({ ...state, selectedDays: getWeekDays(getWeekRange(date).from) })
  
    const handleDayEnter = date =>
      setState({ ...state, hoverRange: getWeekRange(date) })
  
    const handleDayLeave = () =>
      setState({ ...state, hoverRange: undefined })

    // --

    const daysAreSelected = selectedDays.length > 0

    const modifiers = {
      hoverRange,
      selectedRange: daysAreSelected && {
        from: selectedDays[0],
        to: selectedDays[6],
      },
      hoverRangeStart: hoverRange && hoverRange.from,
      hoverRangeEnd: hoverRange && hoverRange.to,
      selectedRangeStart: daysAreSelected && selectedDays[0],
      selectedRangeEnd: daysAreSelected && selectedDays[6]
    }

    const formatDay = moment => ({
      moment,
      startTimestamp: moment.startOf('day').valueOf(),
      endTimestamp: moment.endOf('day').valueOf(),
      dayOfMonth: moment.date(),
      monthNumber: moment.month() + 1,
      year: moment.year()
    })

    const weekData = {
      days: selectedDays.map(day => formatDay(moment(day)))
    }

    // --

    if (!isReady(calendar)) 
      return <h1> loading... </h1>

    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div>
            <DayPicker
              selectedDays={selectedDays}
              showWeekNumbers
              showOutsideDays
              modifiers={modifiers}
              onDayClick={handleDayClick}
              onDayMouseEnter={handleDayEnter}
              onDayMouseLeave={handleDayLeave}
            />
          </div>
          <div style={{ flex: 1 }}>
            <WeekSchedule 
              timestampWithinWeek={weekData.days[0].endTimestamp}
              calendar={calendar}
            />
          </div>
        </div>
      </div>
    )

  }))