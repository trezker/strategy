var MapViewmodel = function() {
	var self = this;
	self.canvas = new Canvas("canvas");
	self.map = null;

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
		var players = InitiatePlayers(temples);

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
			if(self.markedCell.neighbors.indexOf(cell) != -1) {
				cell.soldiers = self.markedCell.soldiers;
				cell.owner = self.markedCell.owner;
				self.markedCell.soldiers = null;
				self.markedCell.markedsoldiers = null;
				self.markedCell = null;
			}
			else {
				if(cell.soldiers) {
					self.markedCell.markedsoldiers = null;
					self.markedCell = null;

					cell.markedsoldiers = cell.soldiers;
					self.markedCell = cell;
				}
			}
		}
		else {
			if(cell.soldiers) {
				cell.markedsoldiers = cell.soldiers;
				self.markedCell = cell;
			}
		}
		self.DrawMap();
	};
};

var mapViewmodel = new MapViewmodel();
ko.applyBindings(mapViewmodel);

mapViewmodel.CreateMap();
