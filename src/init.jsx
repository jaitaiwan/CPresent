import React from 'react'
import ReactDOM from 'react-dom'

// Import our top level component
import TopLevel from 'main'

// Import our react hot-reloader wrapper
import { AppContainer } from 'react-hot-loader'

// Import our router and route components and the browserHistory reducer
import { browserHistory } from 'react-router'

// Import our browser history syncer and router reducer
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux'

// Import our app specific reducers
import * as reducers from 'state/reducers'

// Import our redux thunk middleware
import ReduxThunk from 'redux-thunk'

// Import our Redux Helpers
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'

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


ReactDOM.render(<AppContainer><TopLevel store={store} history={history} /></AppContainer>, document.getElementById("app"))
module.hot.accept()

if (module.hot) {
  module.hot.accept('layouts/app', () => {
    ReactDOM.render(<AppContainer><TopLevel store={store} history={history} /></AppContainer>, document.getElementById('app'))
  })
}
