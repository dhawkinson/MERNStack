// profile.js -- actions (client-side)
// the profile actions -- defines what can be done in the profile section of the app

import axios from 'axios'

import { setAlert } from './alert'
import { 
  GET_PROFILE,
  UPDATE_PROFILE,
  CLEAR_PROFILE,
  ACCOUNT_DELETED,
  PROFILE_ERROR
 } from './types'

// Get Current User Profile
// NOTE: we will not need to touch the reducer for this, we already handle GET_PROFILE & PROFILE ERROR
export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get('/api/profile/me')

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    })
  } catch (err) {
    console.log(err)
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

//  Create or Update a Profile
export const createProfile = (formData, history, edit = false) => async dispatch => {
  try {
    // an axios post requires a header
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    // this is the server-side route
    const res = await axios.post('/api/profile', formData, config)

    // send the type and payload
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    })

    // send a completion message
    dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'))

    // the following is equivalent to a component <Redirect> which cannot be used in an action
    if ( !edit ) {
      history.push('/dashboard')
    }
  } catch (err) {
    // alert if errors
    const errors = err.res.data.errors

    if ( errors ) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
    }
    // set the FAIL action 
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

// Add experience
export const addExperience = (formData, history) => async dispatch => {
  try {
    // an axios post requires a header
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    // this is the server-side route
    const res = await axios.put('/api/profile/experience', formData, config)

    // send the type and payload
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    })

    // send a completion message
    dispatch(setAlert('Experience Added', 'success'))

    // the following is equivalent to a component <Redirect> which cannot be used in an action
    history.push('/dashboard')
  } catch (err) {
    // alert if errors
    const errors = err.res.data.errors

    if ( errors ) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
    }
    // set the FAIL action 
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

// Add education
export const addEducation = (formData, history) => async dispatch => {
  try {
    // an axios post requires a header
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    // this is the server-side route
    const res = await axios.put('/api/profile/education', formData, config)

    // send the type and payload
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    })

    // send a completion message
    dispatch(setAlert('Education Added', 'success'))

    // the following is equivalent to a component <Redirect> which cannot be used in an action
    history.push('/dashboard')
  } catch (err) {
    // alert if errors
    const errors = err.res.data.errors

    if ( errors ) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
    }
    // set the FAIL action 
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

// Delete experience
export const deleteExperience = id => async dispatch => {
  try {
    // this is the server-side route
    const res = await axios.delete(`/api/profile/experience/${id}`)

    // send the type and payload
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    })

    // send a completion message
    dispatch(setAlert('Experience Removed', 'success'))
  } catch (err) {
    // set the FAIL action 
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

// Delete education
export const deleteEducation = id => async dispatch => {
  try {
    // this is the server-side route
    const res = await axios.delete(`/api/profile/education/${id}`)

    // send the type and payload
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    })

    // send a completion message
    dispatch(setAlert('Education Removed', 'success'))
  } catch (err) {
    // set the FAIL action 
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

// Delete account and profile
// no params needed -- account is known from the token
export const deleteAccount = () => async dispatch => {
  if ( window.confirm( 'Are you sure? This cannot be undone.' ) ) {
    try {
      // this is the server-side route
      const res = await axios.delete('/api/profile')
  
      // send the type and payload
      dispatch({ type: CLEAR_PROFILE  })
      dispatch({ type: ACCOUNT_DELETED  })
  
      // send a completion message
      dispatch(setAlert('Account Permenently Removed'))
    } catch (err) {
      // set the FAIL action 
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      })
    }
  }
}