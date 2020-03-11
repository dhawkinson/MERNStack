// auth.js -- actions (client-side)
// the auth actions -- defines what can be done in the authentication process

import axios from 'axios'

import { setAlert } from './alert'
import { 
  REGISTER_SUCCESS, 
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS, 
  LOGIN_FAIL,
  LOGOUT
} from './types'
import setAuthToken from '../utils/setAuthToken'

// Load User -- validate that we have an authorized user
export const loadUser = () => async dispatch => {
  // check for token in localStorage and bring it back if there
  if ( localStorage.token ) {
    setAuthToken(localStorage.token)
  }

  try {
    // get the user
    const res = await axios.get('/api/auth')

    // SUCCESS - set the action to USER_LOADED & pass the payload
    dispatch({
      type: USER_LOADED,
      payload: res.data
    })
  } catch (err) {
    // FAIL - set the action AUTH_ERROR, no payload to pass
    dispatch({
      type: AUTH_ERROR
    })
  }
}

// Register User
export const register = ({ name, email, password }) => async dispatch => {
  // config defines the headers
  const config = {
    headers: {
      'Content-Type': 'Application/json'
    }
  }
  // body contains the form input
  const body = JSON.stringify({ name, email, password })

  try {
    // post the data to the DB
    const res = await axios.post('/api/users', body, config)
    // set the SUCCESS action & place the data in the payload
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    })

    dispatch(loadUser())
  } catch (err) {
    // alert is errors
    const errors = err.response.data.errors

    if ( errors ) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
    }
    // set the FAIL action (we have no payload)
    dispatch({
      type: REGISTER_FAIL
    })
  }
}

// Login User
export const login = (email, password) => async dispatch => {
  // config defines the headers
  const config = {
    headers: {
      'Content-Type': 'Application/json'
    }
  }
  // body contains the form input
  const body = JSON.stringify({ email, password })

  try {
    // post the data to the DB
    const res = await axios.post('/api/auth', body, config)
    // set the SUCCESS action & place the data in the payload
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    })

    dispatch(loadUser())
  } catch (err) {
    // alert is errors
    const errors = err.response.data.errors

    if ( errors ) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
    }
    // set the FAIL action (we have no payload)
    dispatch({
      type: LOGIN_FAIL
    })
  }
}

// Logout / Clear Profile
export const logout = () => dispatch => {
  dispatch({ type: LOGOUT })
}