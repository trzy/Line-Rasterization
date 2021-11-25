/*
 * demo.js
 * Bart Trzynadlowski, 2021
 *
 * Main program. Allows lines to be plotted on a discrete grid.
 */

var g_canvas;
var g_ctx;

// Grid
var g_width = 10;
var g_height = 10;
var g_grid = Array(g_width * g_height).fill(false);

// Line state
var g_lineStarted = false;
var g_lineStart = null;
var g_lineEnd = null;

function canvasToGrid(x, y)
{
  var xStep = g_canvas.width / g_width;
  var yStep = g_canvas.height / g_height;
  x = x / xStep - 0.5;
  y = y / yStep - 0.5;
  return [ x, y ];
}

function gridToCanvas(x, y)
{
  var xStep = g_canvas.width / g_width;
  var yStep = g_canvas.height / g_height;
  x = (x + 0.5) * xStep;
  y = (y + 0.5) * yStep;
  return [ x, y ];
}

function onMouseMove(event)
{
  gridCoords = canvasToGrid(event.offsetX, event.offsetY);
  if (g_lineStarted)
  {
    // Render line in progress
    g_lineEnd = gridCoords;
  }
  $("#Coords").text("x=" + gridCoords[0].toFixed(1) + ", y=" + gridCoords[1].toFixed(1));
}

function onMouseDown(event)
{
  gridCoords = canvasToGrid(event.offsetX, event.offsetY);

  if (!g_lineStarted)
  {
    // Begin new line
    g_lineStart = gridCoords;
    g_lineEnd = null;
    g_lineStarted = true;
  }
  else
  {
    // End line and draw it
    g_lineEnd = gridCoords;
    g_lineStarted = false;
  }
}

function drawLine(x1, y1, x2, y2, color)
{
  g_ctx.beginPath();
  g_ctx.moveTo(x1, y1);
  g_ctx.lineTo(x2, y2);
  g_ctx.lineWidth = 4;
  g_ctx.strokeStyle = color;
  g_ctx.stroke();
}

function update()
{
  // Clear
  g_ctx.fillStyle = "#ffffff";
  g_ctx.fillRect(0, 0, g_canvas.width, g_canvas.height);
  g_grid.fill(false);

  // Rasterize line
  if (g_lineEnd)
  {
    switch($("#Algorithm").val())
    {
    case "bresenham":
      plotLineBresenham(g_grid, g_width, g_height, g_lineStart[0], g_lineStart[1], g_lineEnd[0], g_lineEnd[1]);
      break;
    case "exact":
      plotLineExact(g_grid, g_width, g_height, g_lineStart[0], g_lineStart[1], g_lineEnd[0], g_lineEnd[1]);
    default:
      break;
    }
    var xStep = g_canvas.width / g_width;
    var yStep = g_canvas.height / g_height;
    for (var yi = 0; yi < g_height; yi++)
    {
      for (var xi = 0; xi < g_width; xi++)
      {
        if (g_grid[yi * g_width + xi])
        {
          var canvasCoords = gridToCanvas(xi, yi);
          var x1 = canvasCoords[0] - 0.5 * xStep;
          var y1 = canvasCoords[1] - 0.5 * yStep;
          g_ctx.beginPath();
          g_ctx.fillStyle = "#f5f7ab";
          g_ctx.fillRect(x1, y1, xStep, yStep);
          g_ctx.stroke();
        }
      }
    }
  }

  // Draw vertical lines
  var xStep = g_canvas.width / g_width;
  for (var xi = 0; xi <= g_width; xi++)
  {
    var x = Math.min(xi * xStep, g_canvas.width - 1);
    drawLine(x, 0, x, g_canvas.height - 1, "#000");
  }

  // Draw horizontal lines
  var yStep = g_canvas.height / g_height;
  for (var yi = 0; yi <= g_height; yi++)
  {
    var y = Math.min(yi * yStep, g_canvas.height - 1);
    drawLine(0, y, g_canvas.width - 1, y, "#000");
  }

  // Draw line
  if (g_lineEnd)
  {
    var canvasCoords1 = gridToCanvas(g_lineStart[0], g_lineStart[1]);
    var canvasCoords2 = gridToCanvas(g_lineEnd[0], g_lineEnd[1]);
    var x1 = canvasCoords1[0];
    var y1 = canvasCoords1[1];
    var x2 = canvasCoords2[0];
    var y2 = canvasCoords2[1];
    drawLine(x1, y1, x2, y2, "#00f");
  }

  window.requestAnimationFrame(function() { update(); });
}

function lineRasterDemo()
{
  g_canvas = document.getElementById("Viewport");
  g_ctx = g_canvas.getContext("2d");
  $("#Viewport").mousedown(onMouseDown);
  $("#Viewport").mousemove(onMouseMove);
  window.requestAnimationFrame(function() { update(); });
}