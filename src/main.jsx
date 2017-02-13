import React from 'react'
import ReactDOM from 'react-dom'

// Import our router and route components and the browserHistory reducer
import { Router, Route, IndexRoute, Redirect } from 'react-router'

// Import the helper react component "Provider"
import { Provider } from 'react-redux'



// Import needed components
import App from 'layouts/app'
import Presentation from 'layouts/presentation'


// Import root stylings
import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'





const TopLevel = ({store, history}) => (
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
