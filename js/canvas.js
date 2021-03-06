var Canvas = function(elementId) {
	var self = this;
	self.canvas = document.getElementById("canvas");
	self.canvasContext = self.canvas.getContext("2d");

	self.Resize = function(width, height) {
		$(self.canvas).attr("width", width);
		$(self.canvas).attr("height", height);
	};

	self.DrawLine = function(line) {
		self.canvasContext.strokeStyle = line.color;
		self.canvasContext.moveTo(line.from.x, line.from.y);
		self.canvasContext.lineTo(line.to.x, line.to.y);
	};

	self.NewLines = function() {
		self.canvasContext.beginPath();		
	}

	self.DrawLines = function(lines) {
		self.canvasContext.beginPath();		
		self.canvasContext.strokeStyle = lines.color;
 		self.canvasContext.lineWidth = lines.width;

		for(l in lines.lines) {
			var line = lines.lines[l];
			self.canvasContext.moveTo(line.from.x, line.from.y);
			self.canvasContext.lineTo(line.to.x, line.to.y);
		}

		self.canvasContext.stroke();
	}

	self.FlushLines = function() {
		self.canvasContext.stroke(); 		
	};

	self.DrawPoint = function(point) {
 		self.canvasContext.fillStyle = point.color;
		self.canvasContext.fillRect(point.x - point.size/2, point.y - point.size/2, point.size, point.size);
	};

	self.DrawRect = function(rect) {
 		self.canvasContext.fillStyle = rect.color;
		self.canvasContext.fillRect(rect.x, rect.y, rect.w, rect.h);
	};

	self.DrawPolygon = function(polygon) {
 		self.canvasContext.lineWidth = 1.51;
		self.canvasContext.strokeStyle = polygon.color;
 		self.canvasContext.fillStyle = polygon.color;
		self.canvasContext.beginPath();
		self.canvasContext.moveTo(polygon.corners[0].x, polygon.corners[0].y);
		for(var i = 1; i < polygon.corners.length; i++) {
			self.canvasContext.lineTo(polygon.corners[i].x, polygon.corners[i].y);
		}
		self.canvasContext.closePath();
		self.canvasContext.fill();
		self.canvasContext.stroke(); 		
	};
	
	self.DrawText = function(text) {
		self.canvasContext.fillStyle = text.color;
		self.canvasContext.textAlign = text.align;
		self.canvasContext.font = "12px Arial";
		self.canvasContext.fillText(text.text, text.x, text.y); 	
	};
};
