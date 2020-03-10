// alert.js -- reducers (client-side)
// the alert reducer -- passes & removes alerts throughout the app

import { SET_ALERT, REMOVE_ALERT } from '../actions/types'

// set initial state for alerts
const initialState = []

export default function(state = initialState, action) {
  // destructure the action -- 'type' is the type, 'payload' is the data (in this case the id of the alert)
  const { type, payload } = action
  
  // evaluate the type
  switch(type) {
    case SET_ALERT:
      // add the alert to the existing state
      return [...state, payload]
      case REMOVE_ALERT:
        // remove an alert of the specific id
        return state.filter(alert => alert.id !== payload)
      default:
        // no action -- return state as is
        return state
    
  }
}