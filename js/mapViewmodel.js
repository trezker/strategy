var MapViewmodel = function() {
	var self = this;
	self.canvas = new Canvas("canvas");

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
		var map = new Map(ko.mapping.toJS(self.mapParameters));
		
		map.Generate();
		ConnectIslands(map);
		var temples = PlaceTemples(map);
		var players = InitiatePlayers(temples);

		self.canvas.Resize(map.settings.width, map.settings.height);

		map.DrawPolygons(self.canvas);
		map.DrawPoints(self.canvas);
		map.DrawEdges(self.canvas);
		DrawBorders(map, self.canvas);
		DrawTemples(temples, self.canvas);
		DrawSoldiers(map, self.canvas);
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
	};
};

var mapViewmodel = new MapViewmodel();
ko.applyBindings(mapViewmodel);

mapViewmodel.CreateMap();
