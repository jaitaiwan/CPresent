SignalControl = angular.module 'SignalControl', ['ui.directives','ngSanitize']

SignalControl.factory 'socket', ['$rootScope', ($rootScope) ->
	socket = io.connect '/newui'
	return {
		on: (event, callback) ->
			socket.on event, ->
				args = arguments
				$rootScope.$apply ->
					callback.apply socket, args

		emit: (event, data, callback) ->
			socket.emit event, data, ->
				args = arguments
				$rootScope.$apply ->
					if callback then callback.apply socket, args
	}
]

SignalControlMain = ['$scope','socket', ($scope, socket) ->
	socket.emit 'get:ui'

	socket.on 'update', (data) ->
		setupControl data

	validTags = [
		["V", /^Verse(?:| ((?:[0-9])*))\n$/gim]
		["C", /^Chorus(?:| ((?:[0-9])*))\n$/gim]
		["B", /^Bridge\n$/gim]
		["T", /^Tag\n$/gim]
		["PC", /^Pre-Chorus\n$/gim]
	]

	extras = ["I","T","END"]
	swich = true
	setupControl = (data) ->
		if not data.control? then return false
		lyrics  = angular.copy data.control.live
		tags = []
		for lyric in lyrics
			found = false
			for tag in tags
				if lyric.tag is tag
					found = true
					break
			if not found then tags.push lyric.tag

		tags2 = []
		for test in validTags
			for tag in tags
				res = test[1].exec tag
				if res
					tags2.push if res[1]? then {name:"#{test[0]}#{res[1]}", color:randomColor()} else {name:test[0], color:randomColor()}
		tags2.push {name:tag, color:randomColor()} for tag in extras
		$scope.tags = lyrics
		swich = !swich
		console.log tags2

	abs = (num) ->
		Math.floor num

	socket.on 'set:nextItem', (data) ->
		console.log data
		$scope.item = data

	hsvToRgb = (h, s, v) ->
		h_i = (h * 6)
		f = h * 6 - (abs h_i)
		p = v * (1 - s)
		q = v * (1 - f * s)
		t = v * (1 - (1 - f) * s)
		h_i = abs h_i
		[r, g, b] = [v, t, p] if h_i is 0
		[r, g, b] = [q, v, p] if h_i is 1
		[r, g, b] = [p, v, t] if h_i is 2
		[r, g, b] = [p, q, v] if h_i is 3
		[r, g, b] = [t, p, v] if h_i is 4
		[r, g, b] = [v, p, q] if h_i is 5
		[(abs (r * 256)), (abs (g * 256)), (abs (b * 256))]

	rgbToHex = (data) ->
		[r, g, b] = data
		"##{r.toString 16}#{g.toString 16}#{b.toString 16}"

	h = 0
	randomColor = (s = 0.5, v = 0.95) ->
		goldenRatio = 0.618033988749895
		h += goldenRatio
		h %= 1
		rgbToHex hsvToRgb h, s, v


]