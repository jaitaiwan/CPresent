mongo = require 'mongojs'
config = require './config'
db = mongo.connect(config.db,['songs','setlists']);
ObjectID = mongo.ObjectId

###db.songs.update { _id : ObjectID("505c335f132333813a2c86ad")}, {$set:
	lyrics:"""
Verse 1
He became sin, who knew no sin
So we might become his righteousness

He Humbled himself and carried the cross
Love so amazing
Love so amazing

Chorus
Jesus Messiah
Name above all names
Blessed redeemer
Emmanuel
"""
}, (err, data) ->
	console.log err,data
###
module.exports = 
	getSongs: (req, res, next) ->
		## Get list of songs
		db.songs.find {}, {title:1,author:1}, (err, data) ->
			res.json data

	getSong: (req, res, next) ->
		## Get a single song
		db.songs.findOne {_id:ObjectID(req.params.id)}, (err, data) ->
			res.json(data);

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
		db.songs.save {
			title: req.body.title
			lyrics: req.body.lyrics
		}
		res.send(200);

	deleteSong: (req, res, next) ->
		db.songs.remove({_id:ObjectID(req.params.id)});