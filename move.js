var svgManoeuvre = {
	transMatrix: [1,0,0,1,0,0],
	homeMatrix: [1,0,0,1,0,0],
	init: function (svgElement) {
		this.svgElement = document.getElementById(svgElement);
		var hammertime = Hammer(document).on("drag dragstart dragend tap transformstart transformend pinch", this.eventHandler);

		function displaywheel(e){ 
			svgManoeuvre.startMatrix = svgManoeuvre.transMatrix;
			var evt=window.event || e; //equalize event object 
			var delta=evt.detail? evt.detail*(-120) : evt.wheelDelta; //check for detail first so Opera uses that instead of wheelDelta 
			delta = delta/svgManoeuvre.refactor;
			console.log(delta);
			var k = Math.pow(2,delta/720);
			console.log(evt.pageX, evt.pageY);
			svgManoeuvre.zoom(k, evt.pageX, evt.pageY, false);
			//var zoomAt = svgManoeuvre.getViewboxCoords(evt);
			//svgManoeuvre.zoomToCoords(k, zoomAt.x, zoomAt.y); //delta returns +120 when wheel is scrolled up, -120 when down 
		} 

		var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x 
		this.refactor=(/Firefox/i.test(navigator.userAgent))? 3 : 1;
		
		if (document.attachEvent) //if IE (and Opera depending on user setting) 
			document.attachEvent("on"+mousewheelevt, displaywheel) ;
		else if (document.addEventListener) //WC3 browsers 
			document.addEventListener(mousewheelevt, displaywheel, false);
		
	},
	/*goToHomeView: function () {
		this.setMatrix(this.homeMatrix);
	},
	goTo: function (x, y, scale) {
		newMatrix = [1*scale, 0, 0, 1*scale, (this.view[2]/2)-scale*x, (this.view[3]/2)-scale*y];
		this.setMatrix(newMatrix);
	},*/

	eventHandler: function (evt) {
		switch(evt.type) {
			case ("dragstart"):
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
				console.log(evt.gesture.center.pageX, evt.gesture.center.pageY);
		}
	},
	startDrag: function (evt) {
		this.move = true;
		this.startMatrix = this.transMatrix.slice(0);
		svgManoeuvre.scale = svgManoeuvre.getScale();
	},
	dragIt: function (evt) {
		if (this.move) {
			var dx = evt.gesture.deltaX;
			var dy = evt.gesture.deltaY;
			/*evt.ctrlKey ? this.zoom(Math.pow(2,-dy/100)) : this.pan(svgManoeuvre.scale*dx, svgManoeuvre.scale*dy);*/
			this.pan(dx, dy, true); //transform outside viewbox do not need to use svg coords
		}
	},
	endDrag: function (evt) {
		this.move = false
	},
	startPinch: function (evt) {
		this.startMatrix = this.transMatrix.slice(0);
	},
	pinchIt: function(evt) {
		var gesture = evt.gesture;
		svgManoeuvre.zoom(gesture.scale, gesture.center.pageX, gesture.center.pageY, true);
	},
	zoom: function (scale, centerX, centerY, useStartMatrix) {
		var newMatrix = (useStartMatrix) ? this.startMatrix.slice(0) : this.transMatrix.slice(0);
		for (var i=0; i < 6; i++) { 
			newMatrix[i] *= scale;
		}
		console.log(centerX, centerY);
		newMatrix[4] += (1-scale)*centerX/scale;
		newMatrix[5] += (1-scale)*centerY/scale;
		svgManoeuvre.setMatrix(newMatrix);
	},
	pan: function (dx, dy, useStartMatrix) {
		// Hammer dx and dy properties are related to position at gesture start, therefore must always refer to matrix at start of gesture.
		var newMatrix = (useStartMatrix) ? this.startMatrix.slice(0) : this.transMatrix.slice(0);
		newMatrix[4] += dx;
		newMatrix[5] += dy;
		svgManoeuvre.setMatrix(newMatrix);
		console.log('pan ' + dx);
	},
	setMatrix: function (updateMatrix) {
		if (updateMatrix.length === 6) {
			var strMatrix = "matrix(" +  updateMatrix.join(',') + ")";
			var webkitString = "-webkit-transform: " + strMatrix + ";";
			//this.svgElement.setAttributeNS(null, "transform", strMatrix);
			this.svgElement.setAttributeNS(null, "style", webkitString);
			this.transMatrix = updateMatrix.slice(0);
		}
	},
};
svgManoeuvre.init("manoeuvrable-svg");