var svgManoeuvre = {
	init: function (svgElement) {
		this.svgElement = document.getElementById(svgElement);
		var hammertime = Hammer(document).on("drag dragstart dragend", this.eventHandler);
	},
	eventHandler: function (evt) {
		//console.log(evt.type);
		switch(evt.type) {
			case ("dragstart"):
				svgManoeuvre.startDrag(evt);
			case ("drag"):
				svgManoeuvre.dragIt(evt);
		}
	},
	startDrag: function (evt) {
		svgManoeuvre.startViewbox = svgManoeuvre.getViewbox();
		svgManoeuvre.scale = svgManoeuvre.getScale();
	},
	dragIt: function (evt) {
		var dx = evt.gesture.deltaX;
		var dy = evt.gesture.deltaY;
		var scale = svgManoeuvre.scale;
		svgManoeuvre.pan(scale*dx, scale*dy);
	},
	pan: function (dx, dy) {
		var minX = -dx + +svgManoeuvre.startViewbox[0] ;
		var minY = -dy + +svgManoeuvre.startViewbox[1];
		this.svgElement.setAttribute('viewBox', minX + ' ' + minY + ' ' + svgManoeuvre.startViewbox[2] + ' ' + svgManoeuvre.startViewbox[3]);
	},
	getViewbox: function () {
		return this.svgElement.getAttribute('viewBox').split(' ');
	},
	getScale: function () {
		return this.svgElement.getScreenCTM().inverse().a;
	}
	
};
svgManoeuvre.init("manoeuvrable-svg");