###
app.coffee
###

express = require 'express'
io = require 'socket.io'
app = express()
server = require('http').createServer app
path = require 'path'
iq = io.listen server
app.configure 'development', ->
	app.use express.bodyParser()
	app.use express.static path.normalize './public'
##	app.use "/images", express.static "./templates/images"
##	app.use "/scripts", express.static "./templates/scripts"

try
  routes = require './router'
  app[route.method] route.matches,route.callback for route in routes
catch err
  console.error err

iq.set('log level',2);

status = {
	bg:"#ffffff",
	txt:"#000000",
	v:"mid",
	h:"cen",
	live:false;
	clear:false;
	black:false;
};

iq.sockets.on 'connection', (socket) ->

	socket.on 'go:live', (data) ->
		console.log data
		socket.broadcast.emit 'go:live', data
		status = data
		status.live = true
		status.clear = false
		status.black = false

	socket.on 'go:black', (data) ->
		console.log data
		socket.broadcast.emit 'go:black', data
		status.black = data.stat

	socket.on 'go:clear', (data) ->
		console.log data
		socket.broadcast.emit 'go:clear', data
		status.clear = data.stat

	socket.on 'next:slide', (data) ->
		console.log data
		socket.broadcast.emit 'next:slide', data
		status.text = data.lyric

	socket.on 'toggle:live', (data) ->
		console.log data
		socket.broadcast.emit 'toggle:live', data
		status.live = data.stat

	socket.on 'get:status', (data) ->
		console.log('Sending Status: ',status)
		socket.emit 'set:status', status


server.listen 8080