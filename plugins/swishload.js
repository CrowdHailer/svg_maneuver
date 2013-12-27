svgManoeuvre.holdHandler = function (evt) {
	svgManoeuvre.svgMove = false;
	
	svgManoeuvre.dataLoad = true;
	console.log(evt.target);
	var title = (evt.target.getAttribute('data-swipetitle'));
	if (title) {
		console.log(title);
		console.log(evt.target.tagName);
	}
};
/*svgManoeuvre.swipeupHandler = function (evt) {
	console.log("swipe up");
};
svgManoeuvre.swipedownHandler = function (evt) {
	console.log("swipe down");
};
svgManoeuvre.swipeleftHandler = function (evt) {
	console.log("swipe left");
};
svgManoeuvre.swiperightHandler = function (evt) {
	console.log("swipe right");
};*/
svgManoeuvre.gestureHandler = function (evt) {
	console.log(evt.type);
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
		//case ("transformstart"):
		//case ("dragstart"):
		case ("touch"):
			svgManoeuvre.startMove(evt);
			svgManoeuvre.dataLoad = false;
			break;
		case ("transformend"):
		case ("dragend"):
			svgManoeuvre.startMatrix = svgManoeuvre.transMatrix.slice(0);
			svgManoeuvre.svgMove = false;
			if (svgManoeuvre.dataLoad) {
				alert('load up for ' + evt.gesture.direction);
			}
			break;
		case ("doubletap"):
			svgManoeuvre.zoomPage(1.25, evt.gesture.center.pageX, evt.gesture.center.pageY);
			svgManoeuvre.startMatrix = svgManoeuvre.transMatrix.slice(0);
			break;
		case ("release"):
			//alert('bosh');
			break;
		case ("hold"):
			svgManoeuvre.holdHandler(evt);
			break;
		case ("swipeup"):
			svgManoeuvre.swipeupHandler(evt);
			break;
		case ("swiperight"):
			svgManoeuvre.swiperightHandler(evt);
			break;
		case ("swipeleft"):
			svgManoeuvre.swipeleftHandler(evt);
			break;
		case ("swipedown"):
			svgManoeuvre.swipedownHandler(evt);
	}
};

var swishly = {
	init: function () {
		alert('swishly');
	},
	block: 4
};