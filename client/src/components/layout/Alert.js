// Alert.js -- components/layout (client-side)
// the is the alert handling component.

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

// NOTE:  param 'alerts' is an ES6 destructure of 'props.alerts'
//        this is how 'Alert' reconciles
//        make sure alerts !== null
//        && make sure alerts is not empty (length > 0)
//        && the key = alert.id
const Alert = ({ alerts }) => 
  alerts !== null && alerts.length > 0 && alerts.map(alert => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      { alert.msg }
    </div>
  ))

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
}

// make state available by mapping it to props -- (state.alert comes from combineReducers)
const mapStateToProps = state => ({
  alerts: state.alert
})


// connect() is added to the export because of redux, 
// passes state as first param, no second param because no actions to pass
export default connect(mapStateToProps)(Alert)
