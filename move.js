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
	init: function (svgId) {
		transformGroup = document.getElementById(svgId);
		this.svgElement = document.getElementById('svgDocument');
		this.view = this.getViewbox(this.svgElement);

		var hammertime = Hammer(transformGroup, {prevent_mouseevents: false}).on("touch release tap hold doubletap click mousedown drag dragstart dragend dragup dragdown dragleft dragright swipe swipeup swipedown swipeleft swiperight", function(evt) {
			//console.log(evt.type);
		});
		hammertime.on("touch", function(evt) {
			svgManoeuvre.startMove(evt);
			svgManoeuvre.scale = 1;
		});
		hammertime.on("drag", function(evt) {
			evt.gesture.preventDefault()
			svgManoeuvre.moveIt(evt);
		});
		var hammertime = Hammer(transformGroup).on("release", function(evt) {
			svgManoeuvre.endMove(evt);
		});
		var hammertime = Hammer(transformGroup).on("hold", function(evt) {
			alert('bosh');
			svgManoeuvre.endMove(evt); // needed to stop drag which initiated with touch
		});
		var hammertime = Hammer(transformGroup).on("transform", function(evt) {
			svgManoeuvre.scale = evt.gesture.scale/svgManoeuvre.scale //scale relative to touchdown
			svgManoeuvre.zoom(svgManoeuvre.scale)
		});
		function displaywheel(e){ 
				var evt=window.event || e; //equalize event object 
				var delta=evt.detail? evt.detail*(-120) : evt.wheelDelta; //check for detail first so Opera uses that instead of wheelDelta 
				delta = delta/svgManoeuvre.refactor;
				console.log(delta);
				var k = Math.pow(2,delta/720);
				svgManoeuvre.zoom(k); //delta returns +120 when wheel is scrolled up, -120 when down 
			} 

			var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x 
			this.refactor=(/Firefox/i.test(navigator.userAgent))? 3 : 1;
			
			if (document.attachEvent) //if IE (and Opera depending on user setting) 
				document.attachEvent("on"+mousewheelevt, displaywheel) ;
			else if (document.addEventListener) //WC3 browsers 
				document.addEventListener(mousewheelevt, displaywheel, false);
		this.transformGroup = transformGroup;
	},
	transMatrix: [1,0,0,1,0,0],
	getViewbox: function (svgElement) {
		return svgElement.getAttribute('viewBox').split(' ');
	},
	
	setMatrix: function (updateMatrix) {
		if (updateMatrix.length === 6) {
		strMatrix = "matrix(" +  updateMatrix.join(' ') + ")";
		this.transformGroup.setAttributeNS(null, "transform", strMatrix);
		}
	},
	zoom: function (scale) {
		console.log(scale);
		var transMatrix = this.transMatrix;
		if (scale*transMatrix[0] < 1) { scale = 1 / transMatrix[0]; }
		for (var i=0; i < transMatrix.length; i++) { transMatrix[i] *= scale; }
		transMatrix[4] += (1-scale)*this.view[2]/2;
		transMatrix[5] += (1-scale)*this.view[3]/2;
		this.transMatrix = transMatrix;
		this.setMatrix(transMatrix);
	},
	pan: function (dx, dy) {
		// Hammer dx and dy properties are related to position at gesture start, therefore must always refer to matrix at start of gesture.
		this.transMatrix[4] = this.startMatrix[4] + dx;
		this.transMatrix[5] = this.startMatrix[5] + dy;
		this.setMatrix(this.transMatrix);
	},
	startMove: function (evt) {
		this.move = true;
		this.startMatrix = this.transMatrix.slice(0);
		var xScale = this.view[2]/this.svgElement.offsetWidth;
		var yScale = this.view[3]/this.svgElement.offsetHeight;
		console.log(this.svgElement.offsetWidth);
		console.log(xScale + ' ' + yScale);
		this.scale = (yScale < xScale) ? yScale : xScale;
	},
	moveIt: function (evt) {
		if (this.move) {
			var dx = evt.gesture.deltaX;
			var dy = evt.gesture.deltaY;
			evt.ctrlKey ? this.zoom(Math.pow(2,-dy/100)) : this.pan(this.scale*dx, this.scale*dy);
		}
	},
	endMove: function (evt) {
		this.move = false
	}
};
svgManoeuvre.init("manoeuvrable-svg");