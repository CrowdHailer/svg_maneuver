var svgManoeuvre = {
	init: function (svgElement) {
		this.svgElement = document.getElementById(svgElement);
		var hammertime = Hammer(document).on("drag dragstart dragend tap transformstart transformend pinch", this.eventHandler);
	},
	MAX_VIEWBOX_WIDTH: 2000,
	eventHandler: function (evt) {
		//console.log(evt.target);
		
		switch(evt.type) {
			case ("dragstart"):
				var target = (svgManoeuvre.isDescendant(svgManoeuvre.svgElement,evt.target)) ? "SVG": "other";
				console.log(target);
				console.log(evt.type);
				svgManoeuvre.startDrag(evt);
				break;
			case ("drag"):
				svgManoeuvre.dragIt(evt);
				break;
			case ("transformstart"):
				svgManoeuvre.startPinch(evt);
				break;
			case ("pinch"):
				svgManoeuvre.pinchIt(evt);
				break;
			case ("tap"):
				/*console.log(evt.gesture.center.pageX, evt.gesture.center.pageY);
				console.log(svgManoeuvre.getViewboxCoords(evt.gesture.center));*/
		}
	},
	isDescendant: function (parent, child) {
		var node = child.parentNode;
		while (node != null) {
			if (node == parent) {
				return true;
			}
			node = node.parentNode;
			}
		return false;
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
	startPinch: function (evt) {
		svgManoeuvre.startViewbox = svgManoeuvre.getViewbox();
	},
	pinchIt: function (evt) {
		var gesture = evt.gesture;
		var zoomAt = svgManoeuvre.getViewboxCoords(gesture.center);
		svgManoeuvre.zoom(gesture.scale, zoomAt.x, zoomAt.y);
	},
	zoom: function (scale, svgX, svgY) {
		var newView = svgManoeuvre.startViewbox.slice(0);
		newView[2] /= scale;
		newView[3] /= scale;
		newView[0] = (+newView[0] + svgX*(scale-1))/scale;
		newView[1] = (+newView[1] + svgY*(scale-1))/scale;
		if (newView[2] <= svgManoeuvre.MAX_VIEWBOX_WIDTH) {
			svgManoeuvre.setViewbox(newView);
		}
		//console.log(svgManoeuvre.startViewbox);
	},
	pan: function (dx, dy) {
		var newView = svgManoeuvre.startViewbox.slice(0);
		newView[0] -= dx;
		newView[1] -= dy;
		svgManoeuvre.setViewbox(newView);
	},
	coordinateTransform: function(screenPoint, SvgObject) {
		var CTM = SvgObject.getScreenCTM();
		return screenPoint.matrixTransform( CTM.inverse() );
	},
	getViewboxCoords: function (center) {
		var point = svgManoeuvre.svgElement.createSVGPoint();
		point.x = center.pageX;
		point.y = center.pageY;
		return svgManoeuvre.coordinateTransform(point, svgManoeuvre.svgElement);
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