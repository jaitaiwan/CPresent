Presenter = angular.module('Presenter',['ui.directives','ngSanitize']);

Presenter.factory('socket', ['$rootScope', function($rootScope) {
	var socket = io.connect();
	socket.emitMessage = function() {
		var args = Array.prototype.slice.call(arguments);
		if(args.length<=0)
			return;
		var responseHandler = args[args.length-1];
		if(angular.isFunction(responseHandler)) {
			args[args.length-1] = function() {
				var args = arguments;
				$rootScope.$apply(function() {
					responseHandler.apply(null, args);
				});
			}
		}
		socket.emit.apply(socket, args);
	}

	socket.onEvent = function(e, handler) {
		socket.on(e, function() {
			var args = arguments;
			$rootScope.$apply(function() {
				handler.apply(null, args);
			});
		});
	}

	return socket;
}]);

PresentationManagerController = ['$scope','socket', function($scope,io) {
	$scope.currentSlide = 1;
	$scope.slide = new Array(2);

	io.onEvent('connect',function(data) {
		io.onEvent('set:status',function(data2) {
			console.log('set:status',data2);
			$scope.bg = data2.bg;
			$scope.txt = data2.color;
			$scope.h = data2.h;
			$scope.v = data2.v;
			$scope.black = data2.black;
			$scope.clear = data2.clear;
			$scope.live = data2.live;
			nextSlide(data2.text);
		});
		io.emitMessage('get:status');
	})

	function nextSlide (lyrics) {
		switch($scope.currentSlide) {
			case 0:
			$scope.slide[1] = lyrics;
			$scope.currentSlide = 1;
			break
			case 1:
			$scope.slide[0] = lyrics;
			$scope.currentSlide = 0;
			break;
		}
	}

	io.onEvent('go:live',function(data) {
		console.log("go:live",data)
		$scope.bg = data.bg;
		$scope.txt = data.color;
		$scope.h = data.h;
		$scope.v = data.v;
		nextSlide(data.text);
	});

	io.onEvent('toggle:live',function(data) {
		console.log('toggle:live',data);
		$scope.live = data.stat;
	});

	io.onEvent('go:black',function(data) {
		console.log('go:black',data);
		$scope.black = data.stat;
	});

	io.onEvent('go:clear',function(data) {
		console.log('go:clear',data);
		$scope.clear = data.stat;
	});

	io.onEvent('next:slide',function(data) {
		console.log('next:slide',data);
		nextSlide(data.lyric);
	});
}];

function resizeMe(){
var preferredHeight = 400; 
var fontsize = 30
var displayHeight = $(window).height();
var percentage = displayHeight / preferredHeight;
var newFontSize = Math.floor(fontsize * percentage) - 1;
$("body").css("font-size", newFontSize);
}







$(function() {
	$(window).bind('resize', function() {
		resizeMe();
	}).trigger('resize');
	resizeMe();
});