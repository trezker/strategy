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