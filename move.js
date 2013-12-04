var svgManoeuvre = {
	init: function (svgID) {
		alert('boom');
		this.figure = document.getElementById(svgID);
		this.width  = document.getElementById('svgDocument').offsetWidth;
        this.height = document.getElementById('svgDocument').offsetHeight;
		console.log(this.width);
	},
	transMatrix: [1,0,0,1,0,0],
	setMatrix: function (updateMatrix) {
		if (updateMatrix.length === 6) {
		strMatrix = "matrix(" +  updateMatrix.join(' ') + ")";
		this.figure.setAttributeNS(null, "transform", strMatrix);
		}
	},
	zoom: function (scale) {
		console.log('zoom');
		var transMatrix = this.transMatrix;
		if (scale*transMatrix[0] < 1) { scale = 1 / transMatrix[0]; }
		for (var i=0; i < transMatrix.length; i++) { transMatrix[i] *= scale; }
		console.log(this.width);
		transMatrix[4] += (1-scale)*this.width/2;
		transMatrix[5] += (1-scale)*this.height/2;
		this.transMatrix = transMatrix;
		console.log(transMatrix);
		this.setMatrix(transMatrix);
	},
	pan: function (dx, dy) {
		this.transMatrix[4] += dx;
		this.transMatrix[5] += dy;
		this.setMatrix(this.transMatrix);
	}
};
svgManoeuvre.init("manoeuvrable-svg");
svgManoeuvre.zoom(1);