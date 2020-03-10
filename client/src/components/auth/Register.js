// Register.js -- components/auth (client-side)
// Register user functionality for the front end.

import React, { Fragment, useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { setAlert } from '../../actions/alert'

// NOTE: this format of using the params is an ES6 destructure of props
const Register = ({ setAlert }) => {
  // set initial state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  })

  // deconstruct formData
  const { name, email, password, password2 } = formData

  // change handler
  const onChange = e => setFormData({...formData, [e.target.name]: e.target.value})
  // submit handler
  const onSubmit = async e => {
    e.preventDefault()
    if ( password !== password2 ) {
      setAlert('Passwords do not match', 'danger')
    } else {
      // this is placeholder code that will be removed
      console.log('SUCCESS')
    }
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input 
            type="text" 
            placeholder="Name" 
            name="name" 
            value={name}
            onChange={e => onChange(e)}
            required 
          />
        </div>
        <div className="form-group">
          <input 
            type="email" 
            placeholder="Email Address" 
            name="email" 
            value={email}
            onChange={e => onChange(e)} 
            required 
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password" 
            value={password}
            onChange={e => onChange(e)}
            minLength="6"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2" 
            value={password2}
            onChange={e => onChange(e)}
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>
  )
}

Register.propTypes = {
  setAlert: PropTypes.func.isRequired
}

// connect() is added to the export because of redux, 
// passes state as first param (null in this case), an object of any actions to pass as second param
export default connect(null, { setAlert })(Register)