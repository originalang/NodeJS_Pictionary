let canvas;
let stroke_color;
let stroke_weight;


function setup() {
	canvas = createCanvas(windowWidth, windowHeight);
	stroke_color = 0;
	stroke_weight = 6;

	socket.on('draw_data', drawReceivedData);
	canvas.parent('draw-window');
}

function drawReceivedData(data) {
	strokeWeight(data.weight);
	stroke(data.color);
	line(data.x1, data.y1, data.x2, data.y2)
}

function mouseDragged() {
	strokeWeight(stroke_weight);
	stroke(stroke_color);
	line(mouseX, mouseY, pmouseX, pmouseY);
	let line_data = {
		"x1": mouseX,
		"y1": mouseY,
		"x2": pmouseX,
		"y2": pmouseY,
		"weight": stroke_weight,
		"color": stroke_color
	}
	socket.emit('draw_event', line_data, clientGameCode);
}
