// index.js -- reducers (client-side)
// combine all reducers here

import { combineReducers } from 'redux'

import alert from './alert'
import auth from './auth'
import profile from './profile'

export default combineReducers({
  alert,
  auth,
  profile
})
