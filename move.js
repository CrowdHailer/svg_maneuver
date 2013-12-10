var EventUtill = {
	addHandler: function (element, type, handler) {
		if (element.addEventListener) {
			element.addEventListener(type, handler, false);
		} else if (element.attachEvent) {
			element.attachEvent("on" + type, handler);
		} else {
			element["on" + type] = handler;
		}
	}
};

var svgManoeuvre = {
	transMatrix: [1,0,0,1,0,0],
	init: function (svgId) {
		transformGroup = document.getElementById(svgId);
		this.svgElement = document.getElementById('svgDocument');
		this.view = this.getViewbox(this.svgElement);
		Hammer(document).on("drag transform", function(evt) {
			evt.gesture.preventDefault();
		});
		var hammertime = Hammer(transformGroup, {prevent_mouseevents: true}).on("touch release tap hold doubletap click dblclick mousedown drag dragstart dragend dragup dragdown dragleft dragright swipe swipeup swipedown swipeleft swiperight transform transformstart transformend", function(evt) {
			switch(evt.type) {
				case ("touch"):
					svgManoeuvre.startMove(evt);
					break;
				case ("drag"):
					evt.gesture.preventDefault();
					svgManoeuvre.moveIt(evt);
					break;
				case ("release"):
					svgManoeuvre.endMove(evt);
					break;
				case ("hold"):
					/*alert('bosh');*/
					svgManoeuvre.endMove(evt);
					console.log(svgManoeuvre.getViewboxCoords(evt.gesture.center));
					break;
					
				case ("transform"):
					evt.gesture.preventDefault();
					var zoomAt = svgManoeuvre.getViewboxCoords(evt.gesture.center);
					svgManoeuvre.zoomToCoords(evt.gesture.scale, zoomAt.x, zoomAt.y);
					console.log(evt.gesture.center.pageX);
					svgManoeuvre.endMove(evt);
					break;
				case ("doubletap"):
					alert(evt.gesture.center.x);
					svgManoeuvre.zoomToCoords(1.25, 0, 0);
					break;
			}
		});
		function displaywheel(e){ 
			svgManoeuvre.startMatrix = svgManoeuvre.transMatrix;
			var evt=window.event || e; //equalize event object 
			var delta=evt.detail? evt.detail*(-120) : evt.wheelDelta; //check for detail first so Opera uses that instead of wheelDelta 
			delta = delta/svgManoeuvre.refactor;
			console.log(delta);
			var k = Math.pow(2,delta/720);
			
			var zoomAt = svgManoeuvre.getViewboxCoords(evt);
			svgManoeuvre.zoomToCoords(k, zoomAt.x, zoomAt.y); //delta returns +120 when wheel is scrolled up, -120 when down 
		} 

		var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x 
		this.refactor=(/Firefox/i.test(navigator.userAgent))? 3 : 1;
		
		if (document.attachEvent) //if IE (and Opera depending on user setting) 
			document.attachEvent("on"+mousewheelevt, displaywheel) ;
		else if (document.addEventListener) //WC3 browsers 
			document.addEventListener(mousewheelevt, displaywheel, false);
		this.transformGroup = transformGroup;
	},
	
	getViewbox: function (svgElement) {
		return svgElement.getAttribute('viewBox').split(' ');
	},	
	setMatrix: function (updateMatrix) {
		if (updateMatrix.length === 6) {
			strMatrix = "matrix(" +  updateMatrix.join(' ') + ")";
			this.transformGroup.setAttributeNS(null, "transform", strMatrix);
			this.transMatrix = updateMatrix.slice(0);
		}
	},
	zoomToCoords: function (scale, svgX, svgY) {
		var newMatrix = this.startMatrix;
		for (var i=0; i < 6; i++) { 
			newMatrix[i] *= scale;
		}
		newMatrix[4] += (1-scale)*svgX;
		newMatrix[5] += (1-scale)*svgY;
		this.setMatrix(newMatrix);
	},
	pan: function (dx, dy) {
		// Hammer dx and dy properties are related to position at gesture start, therefore must always refer to matrix at start of gesture.
		var newMatrix = this.startMatrix.slice(0);
		newMatrix[4] += dx;
		newMatrix[5] += dy;
		this.setMatrix(newMatrix);
	},
	startMove: function (evt) {
		this.move = true;
		this.startMatrix = this.transMatrix.slice(0);
		var xScale = this.view[2]/this.svgElement.clientWidth;
		var yScale = this.view[3]/this.svgElement.clientHeight;

		svgManoeuvre.scale = ((yScale > xScale) ? yScale : xScale);
	},
	moveIt: function (evt) {
		if (this.move) {
			var dx = evt.gesture.deltaX;
			var dy = evt.gesture.deltaY;
			/*evt.ctrlKey ? this.zoom(Math.pow(2,-dy/100)) : this.pan(svgManoeuvre.scale*dx, svgManoeuvre.scale*dy);*/
			this.pan(svgManoeuvre.scale*dx, svgManoeuvre.scale*dy);
		}
	},
	endMove: function (evt) {
		this.move = false
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
	}
};
svgManoeuvre.init("manoeuvrable-svg");