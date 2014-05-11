(function() {
	var svgNamespace = 'http://www.w3.org/2000/svg';

	var width = 480;
	var height = 640;
	var plateRadius = 200;
	var ballRadius = 10;
	var boardThickness = 5;
	var boardWidth = 15; // in degree
	var boardSpeed = 7.5; // in degree/frame
	var ballSpeed = 10;
	var frameRate = 24;

	var container = document.getElementById('container');
	var svg = document.createElementNS(svgNamespace, 'svg');
	svg.setAttributeNS(null, 'width', width);
	svg.setAttributeNS(null, 'height', height);
	container.appendChild(svg);

	var cx = width / 2;
	var cy = height / 2;

	var plate = document.createElementNS(svgNamespace, 'circle');
	plate.setAttributeNS(null, 'cx', cx);
	plate.setAttributeNS(null, 'cy', cy);
	plate.setAttributeNS(null, 'r', plateRadius);
	plate.setAttributeNS(null, 'fill', '#dddddd');
	svg.appendChild(plate);
	var ball = document.createElementNS(svgNamespace, 'circle');
	ball.setAttributeNS(null, 'cx', cx);
	ball.setAttributeNS(null, 'cy', cy);
	ball.setAttributeNS(null, 'r', ballRadius);
	ball.setAttributeNS(null, 'fill', '#000000');
	svg.appendChild(ball);

	var r = plateRadius + boardThickness / 2;
	var d = Math.PI * boardWidth / 180;
	var sx = cx - r * Math.sin(d / 2);
	var sy = cy - r * Math.cos(d / 2);
	var ex = cx + r * Math.sin(d / 2);
	var ey = cy - r * Math.cos(d / 2);
	var large = Math.floor(boardWidth / 180);
	var sweep = 1;
	var board = document.createElementNS(svgNamespace, 'path');
	board.setAttributeNS(null, 'd', 'M' + sx + ' ' + sy + ' A' + r + ' ' + r + ', 0, ' + 
		large + ', ' + sweep + ', ' + ex + ' ' + ey);
	board.setAttributeNS(null, 'fill', 'none');
	board.setAttributeNS(null, 'stroke', '#000000');
	board.setAttributeNS(null, 'stroke-width', boardThickness);
	svg.appendChild(board);

	function distance(x1, y1, x2, y2) {
		var dx = x2 - x1;
		var dy = y2 - y1;
		return Math.sqrt(dx * dx + dy * dy);
	}

	var rotation = 0;
	var direction = -1;
	var bx = cx;
	var by = cy;
	var bvx = 0;
	var bvy = ballSpeed;
	var start = false;
	
	function animate() {
		rotation = (rotation + direction * boardSpeed + 360) % 360;
		board.setAttributeNS(null, 'transform', 'rotate(' + (-rotation) + ' ' + cx + ' ' + cy + ')');

		if (!start) {
			return;
		}

		bx += bvx;
		by += bvy;
		ball.setAttributeNS(null, 'cx', bx);
		ball.setAttributeNS(null, 'cy', by);

		var d = distance(bx, by, cx, cy);
		var delta = plateRadius - d;
		if (delta >= 0 && delta < ballRadius && hit()) {
			bounce();
		}
	}

	function hit() {
		var dx = bx - cx;
		var dy = by - cy;
		var angle = (Math.atan2(dy, dx) / Math.PI * 180) + 180;
		var delta = Math.abs(angle - (rotation + 90) % 360);
		delta = Math.min(delta, 360 - delta);
		return delta <= boardWidth / 2;
	}

	function bounce() {
		bvy = -bvy;
	}

	container.addEventListener('click', function() {
		if (!start) {
			start = true;
		}
		direction *= -1;
	});

	function run(timestamp) {
		animate();
		window.setTimeout(run, 1000 / frameRate);
	}
	run((new Date()).getTime());
})();