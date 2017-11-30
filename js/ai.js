function ai(game) {
	var player = game.players[game.currentPlayer];
	if(game.movesLeft() > 0) 
	{
		var movableSoldiers = game.map.centers.filter(function(c) {
			return c.soldiers && c.owner === player && game.occupiedCellsThisTurn.indexOf(c) == -1;
		});
		
		if(movableSoldiers.length == 0) {
			return {action: "End turn"};
		}
		var movableTo = movableSoldiers[0].neighbors.filter(function(c) {
			return !c.water;
		});
		console.log(movableSoldiers);
		console.log(movableTo);
		return {
			action: "Move",
			from: movableSoldiers[0],
			to: movableTo[0],
			soldiers: movableSoldiers[0].soldiers
		};
	}
	return {action: "End turn"};
}