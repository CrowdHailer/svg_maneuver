Hammer.plugins.fakeMultitouch();
//Hammer.plugins.showTouches();

var swishlyFunctions = {
	station: {
		hold: function (data) {},
		left: function (data) {},
		up: function (data) {},
		down: function (data) {}
	},
	line: {
		hold: function (data) {}
	}

};


svgManoeuvre.plugins.swishLoad.init(swishlyFunctions);
svgManoeuvre.init("svgDocument", "manoeuvrable-svg");
svgManoeuvre.plugins.mouseWheel.initMouseWheel();
