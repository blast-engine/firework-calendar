import { QUARTER_HOUR_MS } from './schedule-units.const'

export const relativePositionToTimestamp = 
  ({ quarterHourHeight, dayStartTimestamp }) => 
  relativePosition =>
    Math.round((relativePosition / quarterHourHeight) * QUARTER_HOUR_MS) + dayStartTimestamp 

export const relativeTimestampToYValue = 
  ({ quarterHourHeight }) => 
  relTimestamp =>
    Math.round((relTimestamp) / QUARTER_HOUR_MS) * quarterHourHeight

export const snapTimestampToQuarterHour = 
  ({ dayStartTimestamp }) => 
  timestamp => 
    (Math.round((timestamp - dayStartTimestamp) / QUARTER_HOUR_MS) * QUARTER_HOUR_MS) + dayStartTimestamp