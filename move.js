var EventUtil = {
	addHandler: function (element, type, handler) {
		if (element.addEventListener) {
				element.addEventListener(type, handler, false);
		} else if (element.attachEvent) {
				element.attachEvent("on" + type, handler);
		} else {
				element["on" + type] = handler;
		}
	},
	getEvent: function(event) {
		return event ? event : window.event;
	},
	getWheelDelta: function (event) {
		if (event.wheelDelta) {
			return event.wheelDelta;
		} else {
			return -event.detail * 40;
		}
	}
};

var svgManoeuvre = {
	transMatrix: [1,0,0,1,0,0],
	homeMatrix: [1,0,0,1,0,0],
	MAX_ZOOM: 8,
	MIN_ZOOM: 1,
	//set viewbox to whole area
	//set home transform to initial area
	// Need to add max zooms max pans etc
	init: function (svgElement, transformGroupId) {
		this.transformGroup = document.getElementById(transformGroupId);
		this.svgElement = document.getElementById(svgElement);
		var hammertime = Hammer(document).on("drag dragstart doubletap transformstart transformend pinch", this.gestureHandler);
		window.EventUtil.addHandler(document, "mousewheel", this.handleMouseWheel);
		window.EventUtil.addHandler(document, "DOMMouseScroll", this.handleMouseWheel);
	},
	gestureHandler: function (evt) {
		try {
			evt.gesture.preventDefault();
		} catch (error) {
			console.log(error);
		}
		switch (evt.type) {
			case ("drag"):
				var deltaTime = evt.gesture.timeStamp - svgManoeuvre.lastEvent
				if (deltaTime > 100) {
					svgManoeuvre.lastEvent = evt.gesture.timeStamp;
					svgManoeuvre.dragIt(evt);
				}
				break;
			case ("pinch"):
				var deltaTime = evt.gesture.timeStamp - svgManoeuvre.lastEvent
				if (deltaTime > 100) {
					var zoomAt = svgManoeuvre.getViewboxCoords(evt.gesture.center);
					svgManoeuvre.zoom(evt.gesture.scale, zoomAt.x, zoomAt.y, true);
					svgManoeuvre.lastEvent = evt.gesture.timeStamp;
				}
				break;
			case ("transformstart"):
			case ("dragstart"):
				svgManoeuvre.startMove(evt);
				break;
			case ("doubletap"):
				var zoomAt = svgManoeuvre.getViewboxCoords(evt.gesture.center);
				svgManoeuvre.zoom(2, zoomAt.x, zoomAt.y, false);
				break;
		}
	},
	handleMouseWheel: function (evt) {
		evt = window.EventUtil.getEvent(evt);
		var delta = window.EventUtil.getWheelDelta(evt);
		var k = Math.pow(2,delta/720);
		var zoomAt = svgManoeuvre.getViewboxCoords(evt);
		
		var currentZoom = svgManoeuvre.transMatrix[0]
		k = (currentZoom*k <= svgManoeuvre.MAX_ZOOM) ? k : svgManoeuvre.MAX_ZOOM/currentZoom;
		k = (currentZoom*k >= svgManoeuvre.MIN_ZOOM) ? k : svgManoeuvre.MIN_ZOOM/currentZoom;
		console.log(k);
		svgManoeuvre.zoom(k, zoomAt.x, zoomAt.y, false);
	},
	goToHomeView: function () {
		this.setMatrix(this.homeMatrix);
	},
	goTo: function (x, y, scale) {
		this.setMatrix(svgManoeuvre.zoomMatrix([1,0,0,1,0,0], scale, x, y));
	},
	startMove: function (evt) {
		this.startMatrix = this.transMatrix.slice(0);
		svgManoeuvre.scale = svgManoeuvre.getScale();
		svgManoeuvre.lastEvent = evt.gesture.timeStamp;
	},
	dragIt: function (evt) {
		var dx = evt.gesture.deltaX;
		var dy = evt.gesture.deltaY;
		var scale = svgManoeuvre.scale;
		this.pan(scale*dx, scale*dy, true);
	},
	pan: function (dx, dy, useStartMatrix) {
		// Hammer dx and dy properties are related to position at gesture start, therefore must always refer to matrix at start of gesture.
		var newMatrix = (useStartMatrix) ? this.startMatrix.slice(0) : this.transMatrix.slice(0);
		this.setMatrix(svgManoeuvre.panMatrix(newMatrix, dx, dy));
	},
	panMatrix: function (matrix, dx, dy) {
		matrix[4] += dx;
		matrix[5] += dy;
		return matrix;
	},
	zoom: function (scale, svgX, svgY, useStartMatrix) {
		var newMatrix = (useStartMatrix) ? this.startMatrix.slice(0) : this.transMatrix.slice(0);
		this.setMatrix(svgManoeuvre.zoomMatrix(newMatrix, scale, svgX, svgY));
	},
	zoomMatrix: function (matrix, scale, X, Y) {
		for (var i=0; i < 6; i++) { 
			matrix[i] *= scale;
		}
		matrix[4] += (1-scale)*X;
		matrix[5] += (1-scale)*Y;
		return matrix;
	},
	getViewboxCoords: function (center) {
		var point = this.svgElement.createSVGPoint();
		point.x = center.pageX;
		point.y = center.pageY;
		return svgManoeuvre.coordinateTransform(point, svgManoeuvre.svgElement);
	},
	coordinateTransform: function(screenPoint, someSvgObject) {
		var CTM = someSvgObject.getScreenCTM();
		return screenPoint.matrixTransform( CTM.inverse() );
	},
	getScale: function () {
		return this.svgElement.getScreenCTM().inverse().a;
	},
	getViewbox: function (svgElement) {
		return svgElement.getAttribute('viewBox').split(' ');
	},
	setMatrix: function (updateMatrix) {
	//Sets transform matrix of group denoted as transform group
		if (updateMatrix.length === 6) {
			strMatrix = "matrix(" +  updateMatrix.join(' ') + ")";
			this.transformGroup.setAttributeNS(null, "transform", strMatrix);
			this.transMatrix = updateMatrix.slice(0); //Slice to keep transMatrix as copy
		}
	}
	
};
