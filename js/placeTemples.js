var PlaceTemples = function(map) {
	var allLand = map.AllLand();
	var temples = allLand.sort(() => .5 - Math.random()).slice(0, 8);
	console.log(temples);
	return temples;
};

var DrawTemples = function(temples, canvas) {
	for(var i in temples) {
		console.log(temples[i]);
		canvas.DrawRect({
			x: temples[i].point.x - 5,
			y: temples[i].point.y - 5,
			w: 10,
			h: 10,
			color: "#aaa"
		});
	}
};