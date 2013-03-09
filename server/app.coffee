###
app.coffee
###
coffeescript = require 'coffee-script'
express = require 'express'
io = require 'socket.io'
app = express()
server = require('http').createServer app
path = require 'path'
iq = io.listen server
ca = require 'connect-compiler'
app.configure 'development', ->
	app.use express.bodyParser()
	app.use ca
		enabled: ['coffee','stylus']
		src: path.normalize './pub-src'
		dest: path.normalize './public'

	app.use express.static path.normalize './public'
	app.use express.directory path.normalize './public'

config = require './config'

try
  routes = require './router'
  app[route.method] route.matches,route.callback for route in routes
catch err
  console.error err

iq.set('log level',2)


status =
	background:config.slideBackgroundColor
	color:config.slideTextColor
	vAlign:config.slideTextVerticalOrientation
	hAlign:config.slideTextHorizontalOrientation
	liveState:false
	clearState:false
	blackState:false
	ind: 0

control =
	setlist: []
	live: []

iq.of('/newui').on 'connection', (socket) ->

	socket.on 'get:ui', (data) ->
		console.log "Setting Up Client #{socket.id}"
		console.log control, status
		socket.emit 'update',
			control: control
			status: status

	socket.on 'set:annoucement', (data) ->
		console.log "Saying annoucement"
		socket.broadcast.emit 'say:annoucement', data

	socket.on 'set:liveState', (data) ->
		console.log 'set:liveState', data
		status.liveState = data
		socket.broadcast.emit 'set:liveState', data
		socket.emit 'update', status: status

	socket.on 'set:nextItem', (data) ->
		console.log 'set:nextItem', data
		socket.broadcast.emit 'set:nextItem', data

	socket.on 'set:clearState', (data) ->
		console.log 'set:clearState', data
		status.clearState = data
		socket.broadcast.emit 'set:clearState', data
		socket.emit 'update', status: status

	socket.on 'set:blackState', (data) ->
		console.log 'set:blackState', data
		status.blackState = data
		socket.broadcast.emit 'set:blackState', data
		socket.emit 'update', status: status

	socket.on 'set:index', (data) ->
		console.log 'set:index', data
		status.ind = data
		socket.emit 'update', status: status
		socket.broadcast.emit 'next:slide', data

	socket.on 'set:live', (data) ->
		console.log 'set:live', data
		control = data.control
		status = data.status
		if data.status.ind is -1 then data.status.ind = 0 ## fixes $watch not firing... hack
		socket.broadcast.emit 'setup:show',
			lyrics: data.control.live
			display: data.status
		socket.emit 'update',
			status: status
			control: control
		#socket.broadcast.emit 'next:slide', data.live[data.index]

	socket.on 'set:setlist', (data) ->
		control.setlist = data
		socket.emit 'update', control:control

	socket.on 'please:setup', (data) ->
		console.log "Setup Requested #{socket.id}"
		socket.emit 'setup:show',
			lyrics: control.live
			display: status

server.listen config.port
