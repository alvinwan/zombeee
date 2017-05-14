var map = {
  "padding": 3,
  "grid": [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1]
  ],
  "cell": {
    "padding": 3
  }
}

function setup() {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  drawMap(canvas, ctx, map);
}

function drawMap(canvas, ctx, map) {
  var map_width = map.grid[0].length + (2 * map.padding)
  var map_height = map.grid.length + (2 * map.padding)

  var cell_dimension = Math.min(
    canvas.width / map_width,
    canvas.height / map_height);
  ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
  for (var i = 0; i < map.grid[0].length; i++) {
    for (var j = 0; j < map.grid.length; j++) {
      ctx.fillRect(
        cell_dimension * (i + map.padding) + map.cell.padding,
        cell_dimension * (j + map.padding) + map.cell.padding,
        cell_dimension - (map.cell.padding * 2),
        cell_dimension - (map.cell.padding * 2));
    }
  }
}

window.onload = function() {
  setup()
}
