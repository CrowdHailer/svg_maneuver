var svgManoeuvre = {
	init: function (svgElement) {
		this.svgElement = document.getElementById(svgElement);
		/*console.log(this.getViewbox());
		console.log(this.getScale());
		console.log(this.svgElement.getScreenCTM().inverse());*/
	},
	getViewbox: function () {
		return this.svgElement.getAttribute('viewBox').split(' ');
	},
	/*getScale: function () {
		var view = this.getViewbox();
		var xScale = view[2]/this.svgElement.clientWidth;
		var yScale = view[3]/this.svgElement.clientHeight;
		return ((yScale > xScale) ? yScale : xScale);
	}*/
	getScale: function () {
		return this.svgElement.getScreenCTM().inverse().a;
	}
	
};
svgManoeuvre.init("manoeuvrable-svg");