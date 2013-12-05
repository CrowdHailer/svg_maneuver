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

		var hammertime = Hammer(transformGroup).on("touch", function(evt) {
			console.log('touch');
			svgManoeuvre.startMove(evt);
		});
		var hammertime = Hammer(transformGroup).on("drag", function(evt) {
			
			svgManoeuvre.moveIt(evt);
			
		});
		var hammertime = Hammer(transformGroup).on("release", function(evt) {
			console.log('end');
			svgManoeuvre.endMove(evt);
		});
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
		var transMatrix = this.transMatrix;
		if (scale*transMatrix[0] < 1) { scale = 1 / transMatrix[0]; }
		for (var i=0; i < transMatrix.length; i++) { transMatrix[i] *= scale; }
		transMatrix[4] += (1-scale)*this.view[2]/2;
		transMatrix[5] += (1-scale)*this.view[3]/2;
		this.transMatrix = transMatrix;
		this.setMatrix(transMatrix);
	},
	pan: function (dx, dy) {
		console.log(this.transMatrix[4]);
		this.transMatrix[4] = this.transMatrix[4] + dx;
		this.transMatrix[5] += dy;
		console.log(this.transMatrix[4]);
		this.setMatrix(this.transMatrix);
	},
	startMove: function (evt) {
		this.move = true;
		this.x1 = evt.gesture.center.pageX;
		this.y1 = evt.gesture.center.pageY;
		var xScale = this.view[2]/this.svgElement.offsetWidth;
		var yScale = this.view[3]/this.svgElement.offsetHeight;
		this.scale = (yScale > xScale) ? yScale : xScale;
	},
	moveIt: function (evt) {
		if (this.move) {
			var dx = evt.gesture.center.pageX - this.x1;
			var dy = evt.gesture.center.pageY - this.y1;
			this.x1 = evt.gesture.center.pageX;
			this.y1 = evt.gesture.center.pageY;
			evt.ctrlKey ? this.zoom(Math.pow(2,-dy/100)) : this.pan(this.scale*dx, this.scale*dy);
		}
	},
	endMove: function (evt) {
		this.move = false
	}
};
svgManoeuvre.init("manoeuvrable-svg");