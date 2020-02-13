import { randString, timeout } from '../../utils'
import { transitions, getters } from './state'

export const startDraggingExisting =
  ({ performTransition }) =>
  async ({ calEvent, snappedTouchTimestamp, nowTimestamp }) => {
    await performTransition(transitions.startDraggingExisting, { calEvent, snappedTouchTimestamp, nowTimestamp })
  }

export const startDraggingNew =
  ({ performTransition }) =>
  async ({ snappedTouchTimestamp }) => {
    await performTransition(transitions.startDraggingNew, { snappedTouchTimestamp })
  }

export const extendFocusedEventLengthWithDrag = 
  ({ performTransition, state }) => 
  async ({ snappedTouchTimestamp }) => {
    if (!getters.isDragging(state)) return
    await performTransition(transitions.extendFocusedEventLengthWithDrag, { snappedTouchTimestamp })
  }

export const moveFocusedEventWithDrag = 
  ({ performTransition, state }) =>
  async ({ snappedTouchTimestamp }) => {
    if (!getters.isDragging(state)) return
    await performTransition(transitions.moveFocusedEventWithDrag, { snappedTouchTimestamp })
  }

export const stopDraggingNewAndOpenCreateModal =
  ({ performTransition, state }) =>
  async () => {
    if (!getters.isDraggingNew(state)) return
    await performTransition(transitions.stopDraggingNewAndOpenCreateModal)
  }  

export const stopDraggingExistingAndSave = 
  ({ performTransition, state, events, kernel }) =>
  async () => {
    if (!getters.isDraggingExisting(state)) return
    const fewle = getters.focusedEventWithLocalEdits(state)
    const event = events.item(fewle.id)
    if (!event) return
    await kernel.performUpdates([
      event.setStartTimestamp(fewle),
      event.setEndTimestamp(fewle)
    ])
    await performTransition(transitions.stopDraggingExisting)
  }

export const cancelDraggingExistingAndOpenEditModal = 
  ({ performTransition, state }) =>
  async () => {
    if (!getters.isDraggingExisting(state)) return
    await performTransition(transitions.cancelDraggingExistingAndOpenEditModal)
  }

export const closeModalAndDoNotSave = 
  ({ performTransition }) =>
  async () => {
    await performTransition(transitions.hideFocusedEvent)
    await performTransition(transitions.closeModal)
    await timeout(150)
    await performTransition(transitions.clearFocusedEvent)
  }

export const closeModalAndSave = 
  ({ performTransition, state, kernel, events }) =>
  async () => {
    const fewle = getters.focusedEventWithLocalEdits(state)
    if (getters.isNew(state))
      await kernel.performUpdates([
        events.add({ initArgs: {
          name: fewle.name,
          startTimestamp: fewle.startTimestamp,
          endTimestamp: fewle.endTimestamp
        }})
      ])
    else {
      const event = events.item(fewle.id)
      await kernel.performUpdates([
        event.setStartTimestamp(fewle),
        event.setEndTimestamp(fewle),
        event.setName(fewle)
      ])
    } 
    await performTransition(transitions.hideFocusedEvent)
    await performTransition(transitions.closeModal)
    await timeout(150)
    await performTransition(transitions.clearFocusedEvent)
  }

export const closeModalAndDelete = 
  ({ performTransition, state, deleteEvent }) =>
  async () => {
    const fewle = getters.focusedEventWithLocalEdits(state)
    if (!getters.isNew(state))
      await deleteEvent({ id: fewle.id })
    await performTransition(transitions.hideFocusedEvent)
    await performTransition(transitions.closeModal)
    await timeout(300)
    await performTransition(transitions.clearFocusedEvent)
  }

export const updateFocusedEventName =
  ({ performTransition }) =>
  async newName => {
    await performTransition(transitions.updateFocusedEventName, { newName })
  }