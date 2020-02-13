import { get } from '../../../utils'

export const hasFocusedEvent = state => 
  !!state

export const focusedEvent = state => {
  if (get(state, 'hidden')) return null
  else return state
}

export const isNew = state =>
  get(state, 'isNew')

export const isDragging = state => 
  get(state, 'isDragging')

export const isDraggingNew = state =>
  isDragging(state) && get(state, 'isNew')

export const isDraggingExisting = state =>
  isDragging(state) && !get(state, 'isNew')

export const focusedEventWithLocalEdits = state => {
  if (!hasFocusedEvent(state)) return null
  return {
    id: get(state, 'id'),
    name: get(state, 'name'),
    startTimestamp: get(state, 'startTimestamp'),
    endTimestamp: get(state, 'endTimestamp')
  }
}

export const modalTitle = state =>
  get(state, 'isNew') ? 'new event' : 'edit event'

export const modalIsVisible = state =>
  get(state, 'modalIsOpen')

export const focusedEventName = state => 
  get(state, 'name') || ''

export const shouldTreatAsClick = (state, { releaseTimestamp }) => {
  if (!isDraggingExisting(state)) return undefined
  return (releaseTimestamp - get(state, 'startedToDragAt')) < 200
}