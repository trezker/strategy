var MapViewmodel = function() {
	var self = this;
	self.canvas = new Canvas("canvas");
	self.map = null;
	self.players = null;
	self.currentPlayer = 0;

	self.defaultMapParameters = {
		width: 640,
		height: 480,
		numberOfPoints: 100,
		seed: 1,
		numberOfLloydRelaxations: 2,
		lakeThreshold: .3,
		perlinScale: 3
	};

	self.mapParameters = ko.mapping.fromJS(self.defaultMapParameters);

	self.CreateMap = function() {
		self.map = new Map(ko.mapping.toJS(self.mapParameters));
		
		self.map.Generate();
		ConnectIslands(self.map);
		var temples = PlaceTemples(self.map);
		self.players = InitiatePlayers(temples);

		self.canvas.Resize(self.map.settings.width, self.map.settings.height);
		self.DrawMap();
	};

	self.DrawMap = function() {
		self.map.DrawPolygons(self.canvas);
		self.map.DrawPoints(self.canvas);
		self.map.DrawEdges(self.canvas);
		DrawBorders(self.map, self.canvas);
		DrawTemples(self.map, self.canvas);
		DrawSoldiers(self.map, self.canvas);
	};

	self.markedCell = null;
	self.clickMap = function(data, event) {
		var canvasPosition = $("#canvas").position();
		var coord = {
			x: event.pageX - canvasPosition.left,
			y: event.pageY - canvasPosition.top
		};

		var cell = self.map.NearestCell(coord.x, coord.y);

		if(self.markedCell) {
			if(self.markedCell === cell) {
				cell.markedsoldiers++;
				if(cell.markedsoldiers > cell.soldiers) {
					cell.markedsoldiers = 1;
				}
			}
			if(self.map.CellsAreNeighbors(self.markedCell, cell) && !cell.water) {
				cell.soldiers = self.markedCell.soldiers;
				cell.owner = self.markedCell.owner;
				self.markedCell.soldiers = null;
				self.markedCell.markedsoldiers = null;
				self.markedCell = null;
			}
			else {
				self.markedCell.markedsoldiers = null;
				self.markedCell = null;
				self.markAllSoldiersIfOwned(cell);
			}
		}
		else {
			self.markAllSoldiersIfOwned(cell);
		}

		self.DrawMap();
	};

	self.markAllSoldiersIfOwned = function(cell) {
		if(cell.owner === self.players[self.currentPlayer] && cell.soldiers) {
			cell.markedsoldiers = cell.soldiers;
			self.markedCell = cell;
		}
	};
};

var mapViewmodel = new MapViewmodel();
ko.applyBindings(mapViewmodel);

mapViewmodel.CreateMap();
