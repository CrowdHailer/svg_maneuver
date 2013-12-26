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

svgManoeuvre.handleMouseWheel = function (evt) {
	evt = window.EventUtil.getEvent(evt);
	var delta = window.EventUtil.getWheelDelta(evt);
	var k = Math.pow(2,delta/720);

	svgManoeuvre.zoomPage(k, evt.pageX, evt.pageY);
	svgManoeuvre.startMatrix = svgManoeuvre.transMatrix.slice(0);
};

svgManoeuvre.initMouseWheel = function () {
	window.EventUtil.addHandler(document, "mousewheel", this.handleMouseWheel);
	window.EventUtil.addHandler(document, "DOMMouseScroll", this.handleMouseWheel);

};