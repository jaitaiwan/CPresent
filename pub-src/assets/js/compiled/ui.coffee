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
	status = {}
	control =
		setlist: []
		live: []
	firstrun = true
	###
	# .slideIndex //lyric index int
	# .lyrics // Array of lyrics
	# .blackState // Black state bool
	# .clearState // Clear state bool
	# .liveState // Live state bool
	###
	_varIndex = ['index','lyrics','blackState','clearState','liveState','background','color','vAlign','hAlign','setlist','live']

	## Internal Server Connection ##
	socket.on 'update', (data) ->
		$rootScope.$apply ->
			$rootScope.status = data.status || $rootScope.status
			$rootScope.control = data.control || $rootScope.control
			if firstrun
				$rootScope.slide = data.status
				$rootScope.songIndex = 0
				firstrun = false

	## External API ##
	set: (name, value) ->
		if name in _varIndex then socket.emit "set:#{name}", value

]

ctrl = ['$scope','Server','Songs', ($scope,srv, songs)->
	## Initial setup
	$scope.songlist = songs.getAll()
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
		if $scope.control
			if !$scope.control.setlist? then return false
			song = $scope.control.setlist[n]
			$scope.next = song.title || ''
			if !song.lyrics? then return false
			song.lyrics += "\n\n"
			lyrics = song.lyrics.match /^([\s\S]*?)(?=\n\n|$\w)/gim
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
			$scope.slide.index = 0
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
		$scope.currenttag = $scope.slide.lyrics[prevSection].tag
		srv.set 'index', prevSection

	$scope.addToSetList = (song) ->
		songs.get song._id, (data) ->
			$scope.control.setlist.push(data)
			srv.set 'setlist', $scope.control.setlist

	$scope.loadPreview = (index) ->
		$scope.songIndex = index;

	$scope.changeLyricIndex = (oper) ->
		switch oper
			when "+"
				if $scope.slide.lyrics[$scope.slide.index + 1]? then $scope.slide.index += 1
			when "-"
				if $scope.slide.lyrics[$scope.slide.index - 1]? then $scope.slide.index -= 1
]
