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
	self.AllLand = function() {
		var landcells = [];
		for(i in map.centers) {
			if(map.centers[i].water == false) {
				landcells.push(map.centers[i]);
			}
		}
		return landcells;
	};

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
			for(i in isle) {
				isle[i].isle = true;
			}
		}
		return islands;
	};

	self.ConnectIslandPairs = function(islands) {
		while(islands.length > 1) {

		}
	};

	var allLand = self.AllLand();
	console.log(allLand.length);
	var islands = self.Islands(allLand);
	console.log(allLand.length);
	console.log(islands);
	//self.ConnectIslandPairs(islands);
};