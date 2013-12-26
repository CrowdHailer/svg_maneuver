svgManoeuvre.holdHandler = function (evt) {
	svgManoeuvre.svgMove = false;
	console.log(evt.target);
};
svgManoeuvre.swipeupHandler = function (evt) {
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
};