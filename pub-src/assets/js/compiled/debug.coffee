Debugger = angular.module 'Debugger', ['ui.directives','ngSanitize']

Debugger.factory 'socket', ['$rootScope', ($rootScope) ->
	socket = io.connect('/dashboard')
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

DebugManagerController = ['$scope','socket','$timeout', ($scope,io,$timeout) ->
	$scope.logger = ""
	io.onEvent 'log', (data) ->
		console.log.call console, data
		$scope.logger +=  angular.toJson data
]