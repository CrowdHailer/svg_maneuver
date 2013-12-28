Hammer.plugins.fakeMultitouch();
//Hammer.plugins.showTouches();

var swishlyFunctions = {
	station: {
		hold: function (data) {
			console.log('Station hold function ' + data);
			//should return title for main and directions
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
			return 'Dave'
		}
	}

};

var tapFunctions = {
	id: function (evt) {}

}; 


svgManoeuvre.plugins.swishLoad.init(swishlyFunctions);
svgManoeuvre.plugins.tapManager.init(tapFunctions);
svgManoeuvre.init("svgDocument", "manoeuvrable-svg");
svgManoeuvre.plugins.mouseWheel.initMouseWheel();
