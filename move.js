var svgManoeuvre = {
	transMatrix: [1,0,0,1,0,0],
	startMatrix: [1,0,0,1,0,0],
	MIN_EVENT_DELAY: 120, // time in ms limits rerendering of screen
	MAX_ZOOM: 8,
	MIN_ZOOM: 1,
	svgMove: false,
	plugins: {},
	//set viewbox to whole area
	//set home transform to initial area
	// Need to add max zooms max pans etc
	init: function (svgElement, transformGroupId) {
		this.transformGroup = document.getElementById(transformGroupId);
		this.svgElement = document.getElementById(svgElement);
		var hammertime = Hammer(document).on("touch release drag dragstart dragend doubletap transformstart transformend pinch hold swipeleft swiperight swipeup swipedown", this.gestureHandler);
	},
	gestureHandler: function (evt) {
		try {
			evt.gesture.preventDefault();
		} catch (error) {
			console.log(error);
		}
		switch (evt.type) {
			case ("drag"):
				if (evt.gesture.timeStamp - svgManoeuvre.lastEvent > svgManoeuvre.MIN_EVENT_DELAY && (svgManoeuvre.svgMove)) {
					svgManoeuvre.lastEvent = evt.gesture.timeStamp;
					svgManoeuvre.dragIt(evt);
				}
				break;
			case ("pinch"):
				if (evt.gesture.timeStamp - svgManoeuvre.lastEvent > svgManoeuvre.MIN_EVENT_DELAY && (svgManoeuvre.svgMove)) {
					svgManoeuvre.zoomPage(evt.gesture.scale, evt.gesture.center.pageX, evt.gesture.center.pageY);
					svgManoeuvre.lastEvent = evt.gesture.timeStamp;
				}
				break;
			case ("touch"):
			case ("transformstart"):
			case ("dragstart"):
				svgManoeuvre.startMove(evt);
				break;
			case ("transformend"):
			case ("dragend"):
				svgManoeuvre.startMatrix = svgManoeuvre.transMatrix.slice(0);
				
				break;
			case ("doubletap"):
				svgManoeuvre.zoomPage(1.25, evt.gesture.center.pageX, evt.gesture.center.pageY);
				svgManoeuvre.startMatrix = svgManoeuvre.transMatrix.slice(0);
				break;
			case ("release"):
				svgManoeuvre.svgMove = false;
				//alert('bosh');
				break;
		}
	},
	showAll: function () {
		this.setMatrix([1,0,0,1,0,0]);
	},
	goTo: function (x, y, scale) {
		this.setMatrix(svgManoeuvre.zoomMatrix([1,0,0,1,0,0], scale, x, y));
	},
	startMove: function (evt) {
		svgManoeuvre.startMatrix = svgManoeuvre.transMatrix.slice(0);
		svgManoeuvre.scale = svgManoeuvre.getScale();
		svgManoeuvre.lastEvent = evt.gesture.timeStamp;
		svgManoeuvre.svgMove = svgManoeuvre.isDescendant(svgManoeuvre.svgElement, evt.target)
	},
	dragIt: function (evt) {
		var dx = evt.gesture.deltaX;
		var dy = evt.gesture.deltaY;
		var scale = svgManoeuvre.scale;
		this.pan(scale*dx, scale*dy);
	},
	pan: function (dx, dy) {
		// Hammer dx and dy properties are related to position at gesture start, therefore must always refer to matrix at start of gesture.
		var newMatrix = this.startMatrix.slice(0);
		this.setMatrix(svgManoeuvre.panMatrix(newMatrix, dx, dy));
	},
	panMatrix: function (matrix, dx, dy) {
		matrix[4] += dx;
		matrix[5] += dy;
		return matrix;
	},
	zoomPage: function (scale, pageX, pageY) {
		var currentZoom = svgManoeuvre.transMatrix[0]
		scale = (currentZoom*scale <= svgManoeuvre.MAX_ZOOM) ? scale : 1;//svgManoeuvre.MAX_ZOOM/currentZoom;
		scale = (currentZoom*scale >= svgManoeuvre.MIN_ZOOM) ? scale : 1;//svgManoeuvre.MIN_ZOOM/currentZoom;
		if (scale != 1) {
			var zoomAt = svgManoeuvre.getViewboxCoords(pageX, pageY);
			svgManoeuvre.zoomSVG(scale, zoomAt.x, zoomAt.y);
		}
	},
	zoomSVG: function (scale, svgX, svgY) {
		var newMatrix = this.startMatrix.slice(0);
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
	getViewboxCoords: function (pageX, pageY) {
		var point = this.svgElement.createSVGPoint();
		point.x = pageX;
		point.y = pageY;
		return svgManoeuvre.coordinateTransform(point, svgManoeuvre.svgElement);
	},
	coordinateTransform: function(screenPoint, someSvgObject) {
		var CTM = someSvgObject.getScreenCTM();
		return screenPoint.matrixTransform( CTM.inverse() );
	},
	getScale: function () {
		return this.svgElement.getScreenCTM().inverse().a;
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
