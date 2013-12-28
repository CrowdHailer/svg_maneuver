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
	id: function (evt) {},
	'home-button': function (evt) {
		svgManoeuvre.showAll();
	},
	'goTo-button': function (evt) {
		svgManoeuvre.goTo(1200, 200, 5);
	},
	'pan-button': function (evt) {
		svgManoeuvre.startMatrix = svgManoeuvre.transMatrix.slice(0);
		svgManoeuvre.pan(10, 100);
	},
	'zoom-button': function (evt) {
		svgManoeuvre.startMatrix = svgManoeuvre.transMatrix.slice(0);
		//console.log(svgManoeuvre.getViewbox())
		var box = svgManoeuvre.getViewbox();
		svgManoeuvre.zoomSVG(1.25, box[2]/2, box[3]/2);
	},
	DEFAULT: function (evt) {
		console.log('Default tap response');
	},

}; 


svgManoeuvre.plugins.swishLoad.init(swishlyFunctions);
svgManoeuvre.plugins.tapManager.init(tapFunctions);
svgManoeuvre.init("svgDocument", "manoeuvrable-svg");
svgManoeuvre.plugins.mouseWheel.initMouseWheel();
