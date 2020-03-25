// App.js -- client/src (client-side)
// the front end app wrapper

import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { Provider } from 'react-redux'
import store from './store'

import {  loadUser } from './actions/auth'
import setAuthToken from './utils/setAuthToken'

import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Routes from './components/routing/Routes';

import './App.css';

// check for token in localStorage and bring it back if there
if (localStorage.token) {
  setAuthToken(localStorage.token)
}

const App = () => {
  // run an effect and clean it up only once (on mount and unmount), pass an empty array ([]) as a second argument.
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return ( 
    <Provider store = {  store } >
      <Router >
        <Fragment >
          <Navbar />
            <Switch>
              <Route exact path = '/' component = { Landing } /> 
              <Route component={ Routes } />
            </Switch>
        </Fragment> 
      </Router>
    </Provider>
  )
};
export default App;