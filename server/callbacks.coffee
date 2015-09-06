mongo = require 'mongojs'
config = require './config'
db = mongo(config.dsn,['songs','setlists']);
### MongoJS no longer provides the ObjectID function ###
# db.getLastError ->
# 	console.log arguments
# db.getLastErrorObj ->
# 	console.log arguments
ObjectID = require('mongodb').ObjectID

module.exports = 
	getSongs: (req, res, next) ->
		## Get list of songs
		db.songs.find {}, {title:1,author:1}, (err, data) ->
			res.json data

	getSong: (req, res, next) ->
		## Get a single song
		db.songs.findOne {_id:ObjectID(req.params.id)}, (err, data) =>
			res.json data

	modifySong: (req, res, next) ->
		## Modify a song
		db.songs.update {
			_id:ObjectID(req.params.id)
		},
		{
			$set: {
				title: req.body.title
				lyrics: req.body.lyrics
			}
		}

	createSong: (req, res, next) ->
		## createSong
		result = db.songs.save {
			title: req.body.title
			lyrics: req.body.lyrics
		}
		res.status(200).send(result).end();

	deleteSong: (req, res, next) ->
		db.songs.remove({_id:ObjectID(req.params.id)});

	restartServer: (req, res, next) ->
		process.exit()