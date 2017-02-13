import React from 'react'
import ReactDOM from 'react-dom'

// Import our Redux Helpers
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'

// Import the helper react component "Provider"
import { Provider } from 'react-redux'

// Import our router and route components and the browserHistory reducer
import { Router, Route, browserHistory, IndexRoute, Redirect } from 'react-router'

// Import our browser history syncer and router reducer
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux'

// Import our app specific reducers
import * as reducers from 'state/reducers'

// Import our redux thunk middleware
import ReduxThunk from 'redux-thunk'

// Import needed components
import App from 'layouts/app'
import Presentation from 'layouts/presentation'


// Import root stylings
import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'

// Create the store which manages the global state, dispatching and triggers
const middleware = routerMiddleware(browserHistory)
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  combineReducers({
    ...reducers,
    routing: routerReducer
  }),
  composeEnhancers(applyMiddleware(
    middleware,
    ReduxThunk
  )),
)

const history = syncHistoryWithStore(browserHistory, store)


const TopLevel = _ => (
  <Provider store={store}>
    <Router history={history}>
      <Router path="/" component={App}>
        <IndexRoute component={Presentation} />
      </Router>
      {/* <Route path="*" component={Error} /> */}
    </Router>
  </Provider>
)
export default TopLevel
