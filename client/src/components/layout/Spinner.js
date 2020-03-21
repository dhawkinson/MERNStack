// Spinner.js -- components/layout (client-side)
// spinning wheel functionality for the front end.

import React, {Fragment} from 'react'
import spinner from './spinner.gif'

export default () => (
  <Fragment>
    <img
      src={spinner} 
      style={{ width: '500px', margin: 'auto', display: 'block' }} 
      alt='Loading...'
    />
  </Fragment>
)