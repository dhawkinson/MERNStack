// alert.js -- actions (client-side)
// the alert actions -- defines the actions to take regarding alerts

import { v4 as uuidv4 } from 'uuid'

import { SET_ALERT, REMOVE_ALERT } from './types'

export const setAlert = (msg, alertType, timeout = 2500) => dispatch => {
  // set a uuid for the alert
  const id = uuidv4()

  // create the action package to send
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id }
  })

  setTimeout(() => 
  dispatch({ 
    type: REMOVE_ALERT, 
    payload: id 
  }), timeout)
}
