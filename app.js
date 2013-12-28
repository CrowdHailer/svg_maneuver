Hammer.plugins.fakeMultitouch();
//Hammer.plugins.showTouches();

var swishlyFunctions = {
	station: {
		hold: function (data) {
			console.log('Station hold function ' + data);
		},
		left: function (data) {
			console.log('Station left function ' + data);
		},
		up: function (data) {
			console.log('Station up function ' + data);
		},
		down: function (data) {
			console.log('Station down function ' + data);
		},
		right: function (data) {
			console.log('Station right function ' + data);
		}
	},
	line: {
		hold: function (data) {
			console.log('Line hold function ' + data);
		}
	}

};


svgManoeuvre.plugins.swishLoad.init(swishlyFunctions);
svgManoeuvre.init("svgDocument", "manoeuvrable-svg");
svgManoeuvre.plugins.mouseWheel.initMouseWheel();
