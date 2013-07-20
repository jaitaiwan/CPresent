###
router.coffee
###

callbacks = require './callbacks'

module.exports = [
	matches:"/songs/:id"
	method:"get"
	callback: callbacks.getSong
,
	matches:"/songs"
	method:"get"
	callback: callbacks.getSongs
,
	matches:"/songs"
	method:"put"
	callback: callbacks.createSong
,
	matches:"/songs/:id"
	method:"post"
	callback: callbacks.modifySong
,
	matches:"/songs/:id"
	method:"delete"
	callback: callbacks.deleteSong
,
	matches:"/server/restart"
	method:"get",
	callback: callbacks.restartServer
]