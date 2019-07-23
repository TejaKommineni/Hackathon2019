import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import './index.css';
import App from './App';
import Geographical from './Geographical';
import Global from './Global';
import RegionalContainer from './Regional';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import capacityManagementApp from './redux/Reducers'
import {
  selectGeography,
  selectRegion,
} from './redux/Actions'
const store = createStore(capacityManagementApp)



// Log the initial state
console.log(store.getState())

// Every time the state changes, log it
// Note that subscribe() returns a function for unregistering the listener
const unsubscribe = store.subscribe(() => console.log(store.getState()))

// Dispatch some actions
//store.dispatch(selectGeography('Learn about actions'))
//store.dispatch(selectRegion('Learn about reducers'))

// Stop listening to state updates
unsubscribe()

const rootElement = document.getElementById('root');
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div style={{ height: "100%" }}>
        <Route exact path="/" component={App} />
        <Route path="/global" component={Global} />
        <Route path="/geographical/:id" component={Geographical} />
        <Route path="/regional" component={RegionalContainer} />
      </div>
    </Router>
  </Provider>, rootElement  
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
