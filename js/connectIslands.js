/*
How to make all land connect.
Find all islands.
While more than one island
	Pick two islands
	Find the two centers closest to eachother.
	While not connected
		For each ocean neighbor to one of those points, pick the one closest to the other point and make it land.
	Merge the two islands
*/
var ConnectIslands = function(map) {
	self.Islands = function(allLand) {
		var islands = [];
		while(allLand.length > 0) {
			function buildIsland(isle) {
				var neighbors = allLand.filter(function(i) {
					return i.neighbors.filter(function(j) {
						return isle.indexOf(j) != -1;
					}).length > 0;
				});
				if(neighbors.length == 0) {
					return isle;
				}
				allLand = allLand.filter(function(i) {
					return i.neighbors.filter(function(j) {
						return isle.indexOf(j) != -1;
					}).length == 0;
				});
				isle = isle.concat(neighbors);
				return buildIsland(isle);
			}
		
			var isle = [allLand[0]];
			allLand.splice(0, 1);
			isle = buildIsland(isle)
			islands.push(isle);
		}
		return islands;
	};

	self.ConnectIslandPairs = function(islands) {
		var pangea = islands[0];
		islands.splice(toisland, 1);
		while(islands.length > 0) {
			var closestpairs = islands.map(function(i) {
				return self.ClosestPairBetweenIslands(pangea, i);
			});

			var closestpair = closestpairs.reduce(function(prev, curr) {
				return prev.distance < curr.distance ? prev : curr;
			});
			var toisland = islands.indexOf(closestpair.to)
			pangea = pangea.concat(islands[toisland]);
			islands.splice(toisland, 1);

			self.Bridge(closestpair, pangea);
		}
	};

	self.ClosestPairBetweenIslands = function(from, to) {
		var closestpair = { distance: Number.MAX_VALUE };
		for(var i in from) {
			var p1 = from[i];
			var pairset = to.map(function(p2) {
				var x = p1.point.x-p2.point.x;
				var y = p1.point.y-p2.point.y;
				return { p1: p1, p2: p2, to: to, distance: x*x+y*y };
			});
			var setclosestpair = pairset.reduce(function(prev, curr) {
				return prev.distance < curr.distance ? prev : curr;
			});
			if(setclosestpair.distance < closestpair.distance) {
				closestpair = setclosestpair;
			}
		}
		return closestpair;
	};

	self.Bridge = function(pair, pangea) {
		var neighborsAndDistances = pair.p1.neighbors.map(function(n) {
			var x = n.point.x-pair.p2.point.x;
			var y = n.point.y-pair.p2.point.y;
			return { p: n, distance: x*x+y*y };
		});
		var closest = neighborsAndDistances.reduce(function(prev, curr) {
			return prev.distance < curr.distance ? prev : curr;
		}).p;
		closest.water = false;
		closest.ocean = false;
		pangea.push(closest);
		if(closest !== pair.p2) {
			self.Bridge({ p1: pair.p2, p2: closest }, pangea);
		}
	};

	var allLand = map.AllLand();
	var islands = self.Islands(allLand);
	self.ConnectIslandPairs(islands);
};