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

		self.map.DrawPolygons(self.canvas);
		self.map.DrawPoints(self.canvas);
		self.map.DrawEdges(self.canvas);
		DrawBorders(self.map, self.canvas);
		DrawTemples(temples, self.canvas);
		DrawSoldiers(self.map, self.canvas);
	};

	self.clickMap = function(data, event) {
		var canvasPosition = $("#canvas").position();
		var coord = {
			x: event.pageX - canvasPosition.left,
			y: event.pageY - canvasPosition.top
		};

		self.canvas.DrawPoint({
			x: coord.x,
			y: coord.y,
			color: "#000",
			size: 4
		});

		var nearestCell = self.map.NearestCell(coord.x, coord.y);
		console.log(nearestCell);
		self.canvas.DrawPoint({
			x: nearestCell.point.x,
			y: nearestCell.point.y,
			color: "#f00",
			size: 4
		});
	};
};

var mapViewmodel = new MapViewmodel();
ko.applyBindings(mapViewmodel);

mapViewmodel.CreateMap();
