var InitiatePlayers = function(temples) {
	var players = [];
 	for (var i = 0; i < 4; i++) {
 		var player = {
 			id: i,
 			ai: i>0?ai:null
 		};
 		temples[i].owner = player;
 		temples[i].soldiers = 3;
 		players.push(player);
 	}
 	return players;
};

var DrawSoldiers = function(map, canvas) {
	for(var i in map.centers) {
		DrawCellSoldiers(map.centers[i], canvas);
	}
};

var DrawCellSoldiers = function(cell, canvas) {
	var soldiers = cell.soldiers;
	if(soldiers > 0) {
		var color = "#000";
		var text = soldiers;
		if(cell.markedsoldiers) {
			color = "#fff";
			text = cell.markedsoldiers + " / " + soldiers;
		}
		canvas.DrawText({
			text: text,
			x: cell.point.x,
			y: cell.point.y + 20,
			color: color,
			align: "center"
		});
	}
};

NormalTowards = function(from, to) {
	var n = {
		x: to.x - from.x,
		y: to.y - from.y
	};

	var length = Math.sqrt(n.x*n.x+n.y*n.y);
	n.x /= length;
	n.y /= length;
	return n;
};

AddPoints = function(p1, p2) {
	return {
		x: p1.x + p2.x,
		y: p1.y + p2.y
	};
};

MultiplyPoint = function(p, f) {
	return {
		x: p.x * f,
		y: p.y * f
	};
};

PlayerColor = function(index) {
	var playercolors = [
		"rgba(255,255,  0,1)",
		"rgba(255,  0,255,1)",
		"rgba(  0,255,255,1)",
		"rgba(255,  0,  0,1)"
	];
	return playercolors[index];
};

DrawBorders = function(map, canvas) {
	/*
	for(var i in map.centers) {
		var center = map.centers[i];
		if(center.owner) {
			var color = center.owner.color;
			for(var j in center.borders) {
				canvas.DrawPolygon({
					color: color,
					corners: [
						center.point,
						center.borders[j].v0.point,
						center.borders[j].v1.point
					]
				});
			}
		}
	}
	*/
	var lines = [[],[],[],[]];
	for(var i in map.centers) {
		var center = map.centers[i];
		if(center.owner) {
			var playerId = center.owner.id;
			var cellLines = center.borders.map(function(a) {
				var fromNormal = NormalTowards(a.v0.point, center.point);
				var fromShift = MultiplyPoint(fromNormal, 2);
				var from = AddPoints(a.v0.point, fromShift);
				
				var toNormal = NormalTowards(a.v1.point, center.point);
				var toShift = MultiplyPoint(toNormal, 2);
				var to = AddPoints(a.v1.point, toShift);
				return {
					from: from,
					to: to
				};
			});
			lines[playerId] = lines[playerId].concat(cellLines);
		}
	}
	for(var i in lines) {
		canvas.DrawLines({
			color: PlayerColor(i),
			lines: lines[i],
			width: 4
		});
	}
};
