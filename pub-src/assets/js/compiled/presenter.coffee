Presenter = angular.module 'Presenter', ['ui.directives','ngSanitize']

Presenter.factory 'socket', ['$rootScope', ($rootScope) ->
	socket = io.connect('/newui')
	socket.emitMessage = ->
		args = Array.prototype.slice.call arguments
		if args.length <= 0 then return
		responseHandler = args[args.length-1]
		if angular.isFunction responseHandler
			args[args.length-1] = ->
				args = arguments;
				$rootScope.$apply ->
					responseHandler.apply null, args
		socket.emit.apply socket, args

	socket.onEvent = (e, handler) ->
		socket.on e, ->
			args = arguments
			$rootScope.$apply ->
				handler.apply null, args

	socket;
]

PresentationManagerController = ['$scope','socket','$timeout', ($scope,io,$timeout) ->
	$scope.currentSlide = 1
	$scope.slide = new Array 2
	doTime = ->
		now = new Date()
		hour = if now.getHours().toString().length == 1 then "0" + now.getHours() else now.getHours()
		minute = if now.getMinutes().toString().length == 1 then "0" + now.getMinutes() else now.getMinutes()
		second = if now.getSeconds().toString().length == 1 then "0" + now.getSeconds() else now.getSeconds()
		$scope.clock = "#{hour}:#{minute}:#{second}"
		setTimeout doTime, 250	
		if !$scope.$$phase? then $scope.$apply()
	doTime()

	io.onEvent 'connect', (data) ->
		io.onEvent 'setup:show', (data2) ->
			$scope.status = data2.display
			$scope.lyrics = data2.lyrics
			nextSlide data2.display.ind
		io.emitMessage 'please:setup'

	nextSlide = (lyrics) ->
		if !$scope.lyrics[lyrics]? then return false
		switch $scope.currentSlide
			when 0
				$scope.slide[1] = $scope.lyrics[lyrics].para;
				$scope.currentSlide = 1;
			when 1
				$scope.slide[0] = $scope.lyrics[lyrics].para;
				$scope.currentSlide = 0;

	sayAnnoucement = (announce) ->
		console.log "Saying annoucement", announce
		$scope.announcement = announce
		$scope.announce = true
		$timeout ->
			$scope.announce = false
		, 6000

	io.onEvent 'set:liveState', (data) ->
		$scope.status.liveState = data

	io.onEvent 'set:clearState', (data) ->
		$scope.status.clearState = data

	io.onEvent 'set:blackState', (data) ->
		$scope.status.blackState = data

	io.onEvent 'go:black', (data) ->
		$scope.black = data.stat

	io.onEvent 'go:clear', (data) ->
		$scope.clear = data.stat

	io.onEvent 'next:slide', (data) ->
		nextSlide data

	io.onEvent 'say:annoucement', (data) ->
		sayAnnoucement data
]

resizeMe = ->
	preferredHeight = 400
	fontsize = 30
	displayHeight = $(window).height()
	percentage = displayHeight / preferredHeight
	newFontSize = Math.floor(fontsize * percentage) - 1
	$("body").css "font-size", newFontSize







$ ->
	$(window).bind 'resize', ->
		resizeMe()
	.trigger 'resize'
	resizeMe()
