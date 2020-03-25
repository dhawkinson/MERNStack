// index.js -- reducers (client-side)
// combine all reducers here
// DEVELOPER NOTE: The order of module creation is
//    1. Add the reducer to root reducer (index.js)
//    2. Add the appropriate action(s) to the actions folder
//    3. Add the required component(s)

import { combineReducers } from 'redux'

import alert from './alert'
import auth from './auth'
import profile from './profile'
import post from './post'

export default combineReducers({
  alert,
  auth,
  profile,
  post
})
