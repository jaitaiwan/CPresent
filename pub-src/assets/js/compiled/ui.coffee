###
# ui.coffee
###


Control = angular.module 'Control', ['ui.directives','ngResource','ngSanitize', 'ngCookies']

Control.directive 'colorpicker', ->
	require: '?ngModel'
	link: (scope, element, attrs, controller) ->
		if controller?
			updateModel = (value) ->
				scope.$apply ->
					controller.$setViewValue value

			controller.$render = ->
				color =  new jscolor.color $ element
				$(element).on 'change', (e) ->
					if updateModel?
						updateModel e.target.value
				color

		color =  new jscolor.color element
		$(element).on 'change', (e) ->
			if updateModel? then updateModel e.target.value
		color

Control.directive 'keypress', ->
	link: (scope, element, attrs) ->
		options = scope.$eval attrs.keypress
		$(window.document).on 'keypress', (e) ->
			if options[e.keyCode]?
				scope.$apply ->
					scope.$eval options[e.keyCode]

Control.directive 'keyup', ->
	link: (scope, element, attrs) ->
		options = scope.$eval attrs.keyup
		$(window.document).on 'keyup', (e) ->
			if options[e.keyCode]?
				scope.$apply ->
					scope.$eval options[e.keyCode]


Control.factory 'Songs', ['$resource','$http','$rootScope', (resource, $http,$rootScope) ->
	song = resource '/songs/:id',
		id:'@_id'
	getAll: ->
		song.query()
	get: (id,callback) ->
		song.get
			id:id
		,callback
	edit: (song) ->
		song.$update()
	create: (song,callback) ->
		$http.put('/songs',song)
	remove: (song) ->
		song.$remove()
]

Control.service 'Local', ['$rootScope', ($rootScope) ->
	## Note: preview state shuld be kept in localStorage
	## angular.toJson, angular.fromJson
]

Control.factory 'Server', ['$cookieStore','$rootScope', ($cookie, $rootScope) ->
	## Setup basic vars ##
	socket = io.connect('/newui')
	firstrun = true
	###
	# .slideIndex //lyric index int
	# .lyrics // Array of lyrics
	# .blackState // Black state bool
	# .clearState // Clear state bool
	# .liveState // Live state bool
	###
	_setIndex = ['index','lyrics','blackState','clearState','liveState','background','color','vAlign','hAlign','setlist','live']
	_getIndex = ['ui']
	## Internal Server Connection ##
	socket.on 'update', (data) ->
		$rootScope.status = data.status || $rootScope.status
		$rootScope.control = data.control || $rootScope.control
		if firstrun
			$rootScope.slide = angular.copy(data.status)
			$rootScope.songIndex = 0
			firstrun = false
		$rootScope.$apply()

	## External API ##
	set: (name, value) ->
		if name in _setIndex then socket.emit "set:#{name}", value

	get: (name) ->
		if name in _getIndex then socket.emit "get:#{name}", {}

]

ctrl = ['$scope','Server','Songs','$timeout', ($scope,srv, songs, $timeout)->
	## Initial setup
	$scope.songlist = songs.getAll()
	srv.get 'ui'
	$('#cp').colorpicker({format:'hex'}).on 'changeColor', (ev) ->
		$scope.$apply ->
			$scope.slide.background = ev.color.toHex()

	$('#cp2').colorpicker({format:'hex'}).on 'changeColor', (ev) ->
		$scope.$apply ->
			$scope.slide.color = ev.color.toHex()


	## Watch for model changes and reflect on UI
	$scope.$watch 'status.liveState', (n, o) ->
		$scope.live = if n then 'on' else 'off'

	$scope.$watch 'status.clearState', (n, o) ->
		$scope.clear = if n then 'on' else 'off'

	$scope.$watch 'status.blackState', (n, o) ->
		$scope.black = if n then 'on' else 'off'

	$scope.$watch 'songIndex', (n, o) ->
		_setupLive n

	$scope.$watch 'status.ind', (n, o) ->
		$scope.highlight = []
		$scope.highlight[n] = "highlight"
		if $scope.control?.live[n+1]? 
			$scope.nextLyric = n+1
		else if $scope.control?
			$scope.nextLyric = 0

	$scope.$watch 'nextLyric', (n,o) ->
		$scope.highlight[n] = "nextHighlight"

	_setupLive = (n) ->
		if $scope.control?
			if !$scope.control.setlist[n]? then return false
			songs.get $scope.control.setlist[n]._id, (data) ->
				$scope.next = data.title || ''
				if !data.lyrics? then return false
				data.lyrics += "\n\n"
				lyrics = data.lyrics.match /^([\s\S]*?)(?=\n\n|$\w)/gim
				nl = []
				lastTag = ""
				for lyric in lyrics
					reg = /(?:\n)*((?:Verse [0-9]|Chorus(?:| [0-9])|Tag|Bridge|Pre-Chorus)\n)*([\s\S]*)/gim
					matcher = reg.exec lyric
					if matcher[1]?
						lastTag = matcher[1]
					nl.push
						tag: lastTag
						subtag: if matcher[1]? then true else false
						para:matcher[2].replace /\n/gim, "<br />"
				$scope.slide.lyrics = nl
				$scope.slide.ind = 0
	## Setup ui interaction with serv
	$scope.toggleLive = () ->
		srv.set 'liveState', !$scope.status.liveState

	$scope.toggleClear = () ->
		srv.set 'clearState', !$scope.status.clearState

	$scope.toggleBlack = () ->
		srv.set 'blackState', !$scope.status.blackState

	$scope.align = (dir, val) ->
		switch dir
			when 'h' then $scope.slide.hAlign = val
			when 'v' then $scope.slide.vAlign = val

	$scope.makeLive = () ->
		$scope.$parent.control.live = $scope.slide.lyrics
		$scope.currenttag = $scope.control.live[0].tag
		$scope.$parent.status = $scope.slide
		$scope.$parent.status.liveState = true

		srv.set 'live',
			status: $scope.status
			control: $scope.control
		## Do last so we can grab correct song index first
		if $scope.control.setlist[$scope.songIndex + 1]?
			$scope.songIndex++
		else
			$scope.songIndex = 0

	$scope.nextSlide = (prevSection) ->
		$scope.currenttag = $scope.control.live[prevSection].tag
		srv.set 'index', prevSection

	$scope.addToSetList = (song) ->
		$scope.control.setlist.push(song)
		srv.set 'setlist', $scope.control.setlist
		if !$scope.control.setlist[1]?
			_setupLive 0

	$scope.removeFromSetList = (index) ->
		newArray = new Array()
		newArray = $scope.control.setlist
		newArray.splice(index,1)
		srv.set 'setlist', $scope.control.setlist
		if index == $scope.songIndex and newArray.length != 0
			if $scope.songIndex > (newArray.length - 1)
				_setupLive ($scope.songIndex -= 1)
			else
				_setupLive $scope.songIndex 
		else if newArray.length == 0
			$scope.slide.lyrics = null
			$scope.next = ""
			$scope.slide.index = 0


	$scope.loadPreview = (index,operation) ->
		if operation?
			switch operation
				when "+"
					index++
				when "-"
					index--
		if index < 0 then index = $scope.control.setlist.length-1
		else if index > $scope.control.setlist.length then index = 0
		console.log $scope.control.setlist.length, index
		$scope.songIndex = index;

	$scope.changeOrder = () ->
		_setupLive $scope.songIndex

	$scope.changeLyricIndex = (oper) ->
		switch oper
			when "+"
				if $scope.slide.lyrics[$scope.slide.ind + 1]? then $scope.slide.ind += 1
			when "-"
				if $scope.slide.lyrics[$scope.slide.ind - 1]? then $scope.slide.ind -= 1

	$scope.editSong = (song) ->
		$scope.songIsNew = false
		songs.get song._id, (data) ->
			$scope.editing = "show"
			$scope.edit = data

	$scope.cancelEdit = () ->
		$scope.editing = ""
		$timeout () ->
			$scope.edit = null
			$scope.songIsNew = false
		, 500, true

	$scope.saveSong = () ->
		if $scope.songIsNew is true
			songs.create($scope.edit)
		else
			songs.edit($scope.edit)
		$scope.cancelEdit();
		$scope.songlist = songs.getAll()

	$scope.newSong = () ->
		$scope.songIsNew = true
		$scope.editing = "show"
		$scope.edit = {}

	$scope.deleteSong = () ->
		songs.remove($scope.edit)
		$scope.cancelEdit();
		$scope.songlist = songs.getAll()

	$scope.prevSong = (oper) ->
		switch oper
			when "+"
				if $scope.control.setlist[$scope.songIndex + 1]? then $scope.songIndex += 1
			when "-"
				if $scope.control.setlist[$scope.songIndex - 1]? then $scope.songIndex -= 1
]
