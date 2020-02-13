import * as safe from 'safe-access'
import moment from 'moment'
import { objMap } from '@blast-engine/utils' 

export const shallowClone = obj => ({ ...obj })

export function getWeekDays(weekStart) {
  const days = [weekStart];
  for (let i = 1; i < 7; i += 1) {
    days.push(
      moment(weekStart)
        .add(i, 'days')
        .toDate()
    );
  }
  return days;
}

export function getWeekRange(date) {
  return {
    from: moment(date)
      .startOf('week')
      .toDate(),
    to: moment(date)
      .endOf('week')
      .toDate(),
  };
}

export const timeout = (cb, ms) => new Promise(r => {
  if (typeof cb === 'number') {
    ms = cb
    cb = () => null
  }
  setTimeout(async () => {
    await cb(); r()
  }, ms)
})

export const randString = length => {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const arrayOfLength = length => (new Array(length)).fill(null)

export const uniqueVals = arr => arr.filter((v, i, self) => self.indexOf(v) === i)

export const timestampToLocalTimeOfDay = timestamp => moment(timestamp).format('hh:mma')

export const add0IfSingleDigit = number => {
  if (number < 10) return `0${number}`
  else return `${number}`
}

export const millisecondsToDecimalHours = ms => {
  const minutes = Math.round((ms / 1000) / 60)
  return minutes / 60
}

const decimalHoursAsTimeWithAMPM = decimalHours => {
  const fullHours = Math.floor(decimalHours)
  const am = fullHours < 12 
  const replace0With12 = hours => hours === 0 ? 12 : hours
  const extraFragment = decimalHours % 1
  const extraFagmentInMinutes = extraFragment * 60
  return (
    (am ? replace0With12(fullHours) : replace0With12(fullHours - 12))
    + ':'
    + add0IfSingleDigit(extraFagmentInMinutes)
    + (am ? 'am' : 'pm')
  )
}

export function absolutePosition(el) {
  var
      found,
      left = 0,
      top = 0,
      width = 0,
      height = 0,
      offsetBase = absolutePosition.offsetBase;
  if (!offsetBase && document.body) {
      offsetBase = absolutePosition.offsetBase = document.createElement('div');
      offsetBase.style.cssText = 'position:absolute;left:0;top:0';
      document.body.appendChild(offsetBase);
  }
  if (el && el.ownerDocument === document && 'getBoundingClientRect' in el && offsetBase) {
      var boundingRect = el.getBoundingClientRect();
      var baseRect = offsetBase.getBoundingClientRect();
      found = true;
      left = boundingRect.left - baseRect.left;
      top = boundingRect.top - baseRect.top;
      width = boundingRect.right - boundingRect.left;
      height = boundingRect.bottom - boundingRect.top;
  }
  return {
      found: found,
      left: left,
      top: top,
      width: width,
      height: height,
      right: left + width,
      bottom: top + height
  };
}

// ----

const DELETE_FLAG = '__*delete*__'
const COMMIT_PREFIX = 'commit:'

const _setAtPathInternal = (object = {}, pathArray = [], value) => {
  if (!pathArray.length)
    throw new Error('INVALID PATH ARRAY')
  else if (pathArray.length === 1) {
    const clone = { ...object }
    if (value === DELETE_FLAG) delete clone[pathArray[0]] 
    else clone[pathArray[0]] = value
    return clone
  }
  else
    return { ...object, [pathArray[0]]: _setAtPathInternal(object[pathArray[0]], pathArray.slice(1), value) }
}

const _setAtPath = (object = {}, path = 'example.path', value = true) => { 
  return _setAtPathInternal(object, path.split('.'), value)
}

const _applyTransitionMap = (state, transitionMap) => {
  
  return Object.keys(transitionMap)
    .reduce((nextStateInConstruction, path) => {
      const prevSubState = safe(state, path)
      const nextSubState = typeof transitionMap[path] === 'function'
        ? transitionMap[path](prevSubState, state)
        : transitionMap[path]
      return _setAtPath(nextStateInConstruction, path, nextSubState)
    }, state)

}

export const get = (obj, path) => safe(obj, path)
export const set = (obj, transitionMap) => _applyTransitionMap(obj, transitionMap)
export const unset = (obj, paths) => {
  const pathsArray = Array.isArray(paths) ? paths : [paths]
  const transitionMap = pathsArray.reduce((tm, p) => ({ [p]: DELETE_FLAG, ...tm }), {})
  return set(obj, transitionMap)
}

export const createTransitionPerformer = 
  ({ getState, setState }) => 
  (transition, ...args) => setState(transition(getState(), ...args))

export const createContextProvider = 
  (basicDependencies = {}) =>
  (fnCreators, extraDependencies = {}) => 
    objMap(fnCreators, ac => ac({ ...basicDependencies, ...extraDependencies }))

export const provideContext = 
  (fnCreators, dependencies) =>
    createContextProvider(dependencies)(fnCreators)

// ---

export const arrayItemsAreStrictlyEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false
  for (let i = 0; i < arr1.length; i++)
    if (arr1[i] !== arr2[i]) return false
  return false
}

export const memoized = (fn, argsAreEquivalent = arrayItemsAreStrictlyEqual) => {
  let lastArgs = []
  let lastResult
  return (...args) => {
    if (argsAreEquivalent(lastArgs, args)) return lastResult
    lastResult = fn(...args)
    lastArgs = args
    return lastResult 
  }
}