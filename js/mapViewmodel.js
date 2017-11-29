var MapViewmodel = function() {
	var self = this;
	self.canvas = new Canvas("canvas");
	self.map = null;
	self.players = null;
	self.currentPlayer = 0;
	self.currentPlayerColor = ko.observable(PlayerColor(self.currentPlayer));
	self.movesLeft = ko.observable(3);
	self.winner = ko.mapping.fromJS({
		name: "",
		color: "#000"
	});
	self.gameWon = ko.observable(false);

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

	self.NewGame = function() {
		self.gameWon(false);
		self.movesLeft(3);
		self.currentPlayer = 0;
		self.currentPlayerColor(PlayerColor(self.currentPlayer));
		var r = getRandomInt(0, Number.MAX_SAFE_INTEGER);
		self.mapParameters.seed(r);
		self.CreateMap();
	};

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
			else {
				if(self.map.CellsAreNeighbors(self.markedCell, cell) && !cell.water) {
					self.moveSoldiers(cell);
				}
				else {
					self.deselect();
					self.markAllSoldiersIfOwned(cell);
				}
			}
		}
		else {
			if(self.movesLeft() > 0) {
				self.markAllSoldiersIfOwned(cell);
			}
		}

		self.DrawMap();
	};

	self.markAllSoldiersIfOwned = function(cell) {
		if(cell.owner === self.players[self.currentPlayer] && cell.soldiers && self.occupiedCellsThisTurn.indexOf(cell) == -1) {
			cell.markedsoldiers = cell.soldiers;
			self.markedCell = cell;
		}
	};

	self.occupiedCellsThisTurn = [];
	self.moveSoldiers = function(cell) {
		return new Promise((resolve, reject) => {
			if(self.movesLeft() <= 0) {
				return;
			}
			self.movesLeft(self.movesLeft() - 1);

			if(cell.owner != self.markedCell.owner) {
				self.occupiedCellsThisTurn.push(cell);
			}
			self.battle(cell).then(() => {
				self.deselect();
				self.DrawMap();
				resolve();
			});
		});
	};

	self.battle = function(cell) {
		return new Promise((resolve, reject) => {
			self.inBattle = true;
			function battleRound() {
				if(cell.owner && cell.owner !== self.markedCell.owner) {
					if(cell.soldiers > 0) {
						var r = getRandomInt(0, cell.soldiers + self.markedCell.markedsoldiers);
						if(r > cell.soldiers) {
							cell.soldiers--;
						}
						else {
							self.markedCell.markedsoldiers--;
							self.markedCell.soldiers--;
						}
					}
					if(!cell.soldiers) {
						self.DefeatedCell(cell);
						self.inBattle = false;
					}
					if(self.markedCell.markedsoldiers > 0) {
						self.DrawMap();
						setTimeout(battleRound, 100);
					}
					else {
						resolve();
					}
				}
				else {
					cell.soldiers = (cell.soldiers || 0) + self.markedCell.markedsoldiers;
					cell.owner = self.markedCell.owner;
					
					self.markedCell.soldiers -= self.markedCell.markedsoldiers;
					self.inBattle = false;
					resolve();
				}
			}
			battleRound();
		});
	};
	
	self.DefeatedCell = function(cell) {
		var owner = cell.owner;
		cell.owner = null;
		var anythingLeft = self.map.centers.find(function(c) {
			return c.owner === owner && (c.soldiers > 0 || c.temple);
		});
		if(!anythingLeft) {
			owner.dead = true;

			self.map.centers.forEach(function(cell) {
				if(cell.owner === owner) {
					cell.owner = null;
				}
			});

			var livingPlayers = self.players.filter(function(p) {
				return !p.dead;
			});
			if(livingPlayers.length == 1) {
				self.gameWon(true);
				self.winner.color(PlayerColor(livingPlayers[0].id));
			}
		}
	};

	self.endTurn = function() {
		//Finish turn
		self.map.centers.forEach(function(cell) {
			if(cell.temple && cell.owner === self.players[self.currentPlayer]) {
				cell.soldiers++;
			}
		});
		self.deselect();

		//Find next player
		function findNextPlayer() {
			self.currentPlayer++;
			if(self.currentPlayer >= self.players.length) {
				self.currentPlayer = 0;
			}
			if(self.players[self.currentPlayer].dead) {
				findNextPlayer();
			}
		}
		findNextPlayer();

		//Initiate new turn
		self.movesLeft(3);
		self.currentPlayerColor(PlayerColor(self.currentPlayer));
		self.occupiedCellsThisTurn = [];
		self.DrawMap();

		self.runAI();
	};

	self.runAI = function() {
		var ai = self.players[self.currentPlayer].ai;
		if(ai) {
			var action = ai(self);
			if(action.action == "End turn") {
				self.endTurn();
			}
			if(action.action == "Move") {
				self.markedCell = action.from;
				self.markedCell.markedsoldiers = action.soldiers;
				self.moveSoldiers(action.to).then(() => {
					//self.runAI();
				});
			}
		}
	}

	self.deselect = function() {
		if(self.markedCell) {
			self.markedCell.markedsoldiers = null;
			self.markedCell = null;
		}
	};
};

var mapViewmodel = new MapViewmodel();
ko.applyBindings(mapViewmodel);

mapViewmodel.CreateMap();
