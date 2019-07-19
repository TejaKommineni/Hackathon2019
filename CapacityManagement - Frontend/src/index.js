import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import './index.css';
import App from './App';
import Geographical from './Geographical';
import Global from './Global';
import Regional from './Regional';
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux'


const rootElement = document.getElementById('root');
ReactDOM.render(
    <Router>
      <div style={{ height: "100%" }}>
        <Route exact path="/" component={App} />
        <Route path="/global" component={Global} />
        <Route path="/geographical/:id" component={Geographical} />
        <Route path="/regional" component={Regional} />
      </div>
    </Router>, rootElement  
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
