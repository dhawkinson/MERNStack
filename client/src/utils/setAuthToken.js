// setAuthToken.js -- utils (client-side)
// a utility to persist the user token during the session

import axios from 'axios'

const setAuthToken = token => {
  if ( token ) {
    axios.defaults.headers.common['x-auth-token'] = token
  } else {
    delete axios.defaults.headers.common['x-auth-token']
  }
}

export default setAuthToken