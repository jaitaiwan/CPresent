Presenter = angular.module('Presenter',['ui.directives','ngResource','ngSanitize']);

Presenter.directive('colorpicker', function() {

    return {
        require: '?ngModel',
        link: function(scope, element, attrs, controller) {
            var updateModel;

            if(controller != null) {
                updateModel = function(value) {
                    return scope.$apply(function() {
                        return controller.$setViewValue(value);
                    });
                };

                controller.$render = function() {
                    var color =  new jscolor.color($(element))
                    $(element).on('change',function (e) {
                        if(updateModel) updateModel(e.target.value);
                    });
					return color
                };
            }

            var color =  new jscolor.color(element)
            $(element).on('change',function (e) {
                if(updateModel) updateModel(e.target.value);
            });
			return color

        }
    };
});



Presenter.factory('Songs',['$resource','$http','$rootScope',function (resource, $http,$rootScope) {
	song = resource('/songs/:id',{id:'@_id'});
	return {
		getAll: function() {
			return song.query();
		},

		get: function (id,callback) {
			return song.get({id:id},callback)
		},
		edit: function(song) {
			song.$update();
		},
		create: function(song,callback) {
			$http.put('/songs',song);
		},
		remove: function (song) {
			song.$remove();
		}
	}
}]);

Presenter.factory('Server',function () {
	var socket = io.connect();
	return {
		goLive: function(lyric, slideBgC, slideTxtC, slideH, slideV) {
			socket.emit('go:live',{
				text: lyric,
				bg: slideBgC,
				color: slideTxtC,
				h: slideH,
				v: slideV
			});
		},
		toggleLive: function(bool) {
			socket.emit('toggle:live',{stat:bool});
		},
		goBlack: function(bool) {
			socket.emit("go:black",{stat: bool});
		},
		goClear: function(bool) {
			socket.emit("go:clear",{stat:bool});
		},
		changeSlide: function(lyric) {
			socket.emit("next:slide",{lyric:lyric});
		}
	}
});

PresentationManagerController = ['$scope','Songs','Server', function($scope,Songs,io2) {
	$scope.songlist = Songs.getAll()
	$scope.setlist = [];
	$scope.lyrics = [];
	$scope.slideV = "mid";
	$scope.slideH = "cen";
	$scope.prevLyrics = [];
	$scope.isLive = false;
	$scope.live = '#fff';
	$scope.tester = "";
	$scope.callLive = function () {
		$scope.live = $scope.isLive ? '#33B5E5' : '#ffffff';
		io2.toggleLive($scope.isLive);
	}

	socket = io.connect();
	socket.on('connect',function() {
		socket.on('set:setlist',function(data) {
			$scope.setlist = data;
			$scope.$watch('setlist',function (n,o) {
				socket.emit('set:setlist',$scope.setlist);
			},true);
			$scope.$digest();
		});
		socket.emit('get:setlist',{});
	});
}];

SongListController = ['$scope','Songs',function ($scope,Songs) {
	$scope.delDisp = {display:'none'};

	$scope.addToSetList = function(song) {
		// For some reason you have to create a new array instead of manipulating the old one.
		var newArray = new Array();
		newArray = $scope.setlist
		newArray.push(Songs.get(song._id));
		$scope.$parent.setlist = newArray;
	}

	$scope.shDelete = function (element) {
		$scope.search != "" ? $scope.delDisp = {display:'block'} : $scope.delDisp = {display:'none'};
	}

	$scope.focused = function(ami) {
		$scope.focus = ami? 'focused' : '';
	}

	$scope.hover = function(ami) {
		$scope.hoverd = ami? 'hovered' : '';
	}

	$scope.editSong = function (song) {
		newsong = Songs.get(song._id, function () {
			$scope.tester = newsong;
			$scope.songEdit = true;
			$scope.isNew = false;
		});
	}

	$scope.saveSong = function(song,n) {
		!n ? Songs.edit(song) : Songs.create(song);
		$scope.$parent.songlist = Songs.getAll();
		$scope.songEdit = false;
	}

	$scope.songDelete = function(song) {
		Songs.remove(song);
		$scope.songEdit = false;
		$scope.$parent.songlist = Songs.getAll()
	}
}];

SetListController = function ($scope) {
	$scope.removeFromSetList = function (index) {
		var newArray = new Array();
		newArray = $scope.setlist
		newArray.splice(index,1);
		$scope.setlist= newArray;
	};

	$scope.showLyrics = function (song) {
		if(typeof song.lyrics === "undefined") return false;
		song.lyrics += "\n\n"
		lyrics = song.lyrics.match(/^([\s\S]*?)(?=\n\n|$\w)/gim);
		for(i=0;i<lyrics.length;i++) {
			reg = /(?:\n)*((?:Verse [0-9]|Chorus(?:| [0-9])|Tag|Bridge|Pre-Chorus)\n)*([\s\S]*)/gim
			matcher = reg.exec(lyrics[i]);
			lyrics[i] = {tag: (typeof matcher[1] !== "undefined") ? matcher[1] : "" , para:matcher[2].replace(/\n/gim,"<br />")};
		}
		$scope.lyrics.splice(0);
		for(i=0;i<lyrics.length;i++) {
			$scope.lyrics.push(lyrics[i]);
		}
		$scope.$parent.preview  = lyrics[0].para;
	};
}

SlideController = ['$scope','Server',function ($scope, io) {
	$('#cp').colorpicker({format:'hex'}).on('changeColor', function(ev) {
		$scope.$apply(function() {
			$scope.$parent.slideBgC = ev.color.toHex();
		});
	});

	$('#cp2').colorpicker({format:'hex'}).on('changeColor', function(ev) {
		$scope.$apply(function() {
			$scope.$parent.slideTxtC = ev.color.toHex();
		});
	});

	$scope.$parent.slideBgC = "#ffffff"
	$scope.$parent.slideTxtC = "#000000"
	$scope.loadLyric = function (lyric) {
		$scope.$parent.preview  = lyric.para;
	}

	$scope.alignH = function (align) {
		$scope.$parent.slideH = align;
	}

	$scope.alignV = function (align) {
		$scope.$parent.slideV = align;
	}
	
	$scope.updateSlideBgC = function (value) {
		console.log(value)
	}
	applyscope = function() {
		$scope.$parent.$digest();
	}
	$("#slider").on('change',applyscope)

	$scope.goLive = function (lyrics) {
		$scope.$parent.prevH = $scope.$parent.slideH;
		$scope.$parent.prevV = $scope.$parent.slideV;
		$scope.$parent.preview2 = $scope.$parent.preview;
		$scope.$parent.prevTxtC = $scope.$parent.slideTxtC
		$scope.$parent.prevBgC = $scope.$parent.slideBgC;
		$scope.$parent.black = "#000"
		$scope.prevLyrics.splice(0);
		for(i=0;i<lyrics.length;i++) {
			$scope.prevLyrics.push(lyrics[i]);
		}
		$scope.$parent.isLive = true;
		$scope.$parent.callLive()
		io.goLive($scope.$parent.preview,$scope.$parent.prevBgC,$scope.$parent.prevTxtC,$scope.$parent.slideH,$scope.$parent.slideV);
	}
}];

LiveController = ['$scope','Server',function ($scope,io) {
	$scope.$parent.black = "#000"
	$scope.clear = false;

	$scope.loadLyric = function (lyric) {
		$scope.$parent.preview2  = lyric.para;
		io.changeSlide(lyric.para);
	}

	$scope.toggleBlack = function() {
		var oldColor = $scope.$parent.prevBgC;
		$scope.$parent.prevBgC = $scope.$parent.black;
		$scope.$parent.black = oldColor;
		$scope.clear = $scope.$parent.black == "#000" ? true :false;
		io.goBlack($scope.$parent.black != "#000");
	}

	$scope.toggleClear = function () {
		$scope.clear = !$scope.clear;
		io.goClear($scope.clear);
	}
}];