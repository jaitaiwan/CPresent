import React from 'react'
import ReactDOM from 'react-dom'

// Import our react hot-reloader wrapper
import { AppContainer } from 'react-hot-loader'

// Import our top level component
import TopLevel from 'main'


ReactDOM.render(<AppContainer><TopLevel /></AppContainer>, document.getElementById("app"))

if (module.hot) {
  module.hot.accept('layouts/app', () => {
    ReactDOM.render(<AppContainer><TopLevel /></AppContainer>, document.getElementById('app'))
  })
}
