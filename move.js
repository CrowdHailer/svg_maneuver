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
	init: function (svgElement, transformGroupId) {
		transformGroup = document.getElementById(transformGroupId);
		this.svgElement = document.getElementById(svgElement);
		this.view = this.getViewbox(this.svgElement);
		Hammer(document).on("drag transform", function(evt) {
			evt.gesture.preventDefault();
		});
		var hammertime = Hammer(transformGroup, {prevent_mouseevents: true}).on("touch release tap hold doubletap click dblclick mousedown drag dragstart dragend dragup dragdown dragleft dragright swipe swipeup swipedown swipeleft swiperight transform transformstart transformend", function(evt) {
			//console.log(evt.type);
			switch(evt.type) {
				case ("dragstart"):
					svgManoeuvre.startDrag(evt);
					svgManoeuvre.lastEvent = evt.gesture.timeStamp;
					break;
				case ("drag"):
					evt.gesture.preventDefault();
					var deltaTime = evt.gesture.timeStamp - svgManoeuvre.lastEvent
					if (deltaTime > 100) {
						svgManoeuvre.lastEvent = evt.gesture.timeStamp;
						svgManoeuvre.dragIt(evt);
					}
					break;
				case ("transformstart"):
					svgManoeuvre.startZoom(evt);
					svgManoeuvre.lastEvent = evt.gesture.timeStamp;
					break;
				case ("transform"):
					evt.gesture.preventDefault();
					var deltaTime = evt.gesture.timeStamp - svgManoeuvre.lastEvent
					if (deltaTime > 100) {
						var zoomAt = svgManoeuvre.getViewboxCoords(evt.gesture.center);
						svgManoeuvre.zoom(evt.gesture.scale, zoomAt.x, zoomAt.y, true);
						svgManoeuvre.lastEvent = evt.gesture.timeStamp;
					}
					break;
				case ("doubletap"):
					var zoomAt = svgManoeuvre.getViewboxCoords(evt.gesture.center);
					svgManoeuvre.zoom(1.25, zoomAt.x, zoomAt.y, false);
					break;
			}
		});
		window.EventUtil.addHandler(document, "mousewheel", this.handleMouseWheel);
		window.EventUtil.addHandler(document, "DOMMouseScroll", this.handleMouseWheel);
		this.transformGroup = transformGroup;
	},
	handleMouseWheel: function (evt) {
		evt = window.EventUtil.getEvent(evt);
		var delta = window.EventUtil.getWheelDelta(evt);
		var k = Math.pow(2,delta/720);
		var zoomAt = svgManoeuvre.getViewboxCoords(evt);
		svgManoeuvre.zoom(k, zoomAt.x, zoomAt.y, false);
	},
	goToHomeView: function () {
		this.setMatrix(this.homeMatrix);
	},
	goTo: function (x, y, scale) {
		newMatrix = [1*scale, 0, 0, 1*scale, (this.view[2]/2)-scale*x, (this.view[3]/2)-scale*y];
		this.setMatrix(newMatrix);
	},
	getViewbox: function (svgElement) {
		return svgElement.getAttribute('viewBox').split(' ');
	},	
	startZoom: function (evt) {
		this.startMatrix = this.transMatrix.slice(0);
	},
	
	startDrag: function (evt) {
		this.startMatrix = this.transMatrix.slice(0);
		svgManoeuvre.scale = svgManoeuvre.getScale();
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
		for (var i=0; i < 6; i++) { 
			newMatrix[i] *= scale;
		}
		newMatrix[4] += (1-scale)*svgX;
		newMatrix[5] += (1-scale)*svgY;
		this.setMatrix(newMatrix);
	},
	zoomMatrix: function (matrix, scale, svgX, svgY) {
		for (var i=0; i < 6; i++) { 
			matrix[i] *= scale;
		}
		matrix[4] += (1-scale)*svgX;
		matrix[5] += (1-scale)*svgY;
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
	setMatrix: function (updateMatrix) {
	//Sets transform matrix of group denoted as transform group
		if (updateMatrix.length === 6) {
			strMatrix = "matrix(" +  updateMatrix.join(' ') + ")";
			this.transformGroup.setAttributeNS(null, "transform", strMatrix);
			this.transMatrix = updateMatrix.slice(0); //Slice to keep transMatrix as copy
		}
	}
	
};
svgManoeuvre.init("svgDocument", "manoeuvrable-svg");