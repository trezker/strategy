var InitiatePlayers = function(temples) {
	var players = [];
 	for (var i = 0; i < 4; i++) {
 		var player = {};
 		temples[i].owner = player;
 		temples[i].soldiers = 3;
 		players.push(player);
 	}
 	return players;
};

var DrawSoldiers = function(map, canvas) {
	for(var i in map.centers) {
		var soldiers = map.centers[i].soldiers;
		if(soldiers > 0) {
			canvas.DrawText({
				text: soldiers,
				x: map.centers[i].point.x,
				y: map.centers[i].point.y + 20,
				color: "#000",
				align: "center"
			});
		}
	}
};