var MapViewmodel = function() {
	var self = this;

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

		var canvas = new Canvas("canvas");
		canvas.Resize(map.settings.width, map.settings.height);

		map.DrawPolygons(canvas);
		map.DrawPoints(canvas);
		map.DrawEdges(canvas);
		DrawBorders(map, canvas);
		DrawTemples(temples, canvas);
		DrawSoldiers(map, canvas);
	};
};

var mapViewmodel = new MapViewmodel();
ko.applyBindings(mapViewmodel);

mapViewmodel.CreateMap();
