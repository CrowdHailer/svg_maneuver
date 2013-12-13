var svgManoeuvre = {
	init: function (svgElement) {
		this.svgElement = document.getElementById(svgElement);
		var hammertime = Hammer(document).on("drag dragstart dragend tap", this.eventHandler);
	},
	eventHandler: function (evt) {
		//console.log(evt.type);
		switch(evt.type) {
			case ("dragstart"):
				svgManoeuvre.startDrag(evt);
			case ("drag"):
				svgManoeuvre.dragIt(evt);
			case ("tap"):
				console.log(evt.gesture.center.pageX, evt.gesture.center.pageY);
				console.log(svgManoeuvre.getViewboxCoords(evt.gesture.center));
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
		var newView = svgManoeuvre.startViewbox.slice(0);
		newView[0] -= dx;
		newView[1] -= dy;
		svgManoeuvre.setViewbox(newView);
	},
	getViewboxCoords: function (center) {
		var point = svgManoeuvre.svgElement.createSVGPoint();
		point.x = center.pageX;
		point.y = center.pageY;
		return svgManoeuvre.coordinateTransform(point, svgManoeuvre.svgElement);
	},
	coordinateTransform: function(screenPoint, SvgObject) {
		var CTM = SvgObject.getScreenCTM();
		return screenPoint.matrixTransform( CTM.inverse() );
	},
	getViewbox: function () {
		return this.svgElement.getAttribute('viewBox').split(' ');
	},
	setViewbox: function (list) {
		this.svgElement.setAttribute('viewBox', list.join(' '));
	},
	getScale: function () {
		return this.svgElement.getScreenCTM().inverse().a;
	}
	
};
svgManoeuvre.init("manoeuvrable-svg");