// store.js -- client root (client-side)
// establish the app store

import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import rootReducer from './reducers'

// set the initial state to an empty object
const initialState = {}
// Redux Thunk middleware allows you to write action creators that return a function instead of an action.
const middleware = [thunk]
// cretae the app store
const store = createStore(
  rootReducer,                                          // grab the root reducer (combination of all reducers)
  initialState,                                         // grab the initial state
  composeWithDevTools(applyMiddleware(...middleware))   // put it together with Thunk
)

export default store