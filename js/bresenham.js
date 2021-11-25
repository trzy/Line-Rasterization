/*
 * bresenham.js
 * Bart Trzynadlowski, 2021
 *
 * Plots lines using the famous Bresenham algorithm.
 */

function plotLineBresenham(grid, width, height, x1, y1, x2, y2)
{
  // Bresenham's algorithm requires integral endpoints
  x1 = Math.floor(x1 + 0.5);
  y1 = Math.floor(y1 + 0.5);
  x2 = Math.floor(x2 + 0.5);
  y2 = Math.floor(y2 + 0.5);

  // Plot line
  var dx = Math.abs(x2 - x1);
  var sx = x1 < x2 ? 1 : -1;
  dy = -Math.abs(y2 - y1);
  sy = y1 < y2 ? 1 : -1;
  err = dx + dy;
  while (true)
  {
    grid[y1 * height + x1] = true;
    if (x1 == x2 && y1 == y2)
    {
      break;
    }
    e2 = 2 * err;
    if (e2 >= dy) // e_xy + e_x > 0
    {
      err += dy;
      x1 += sx;
    }
    if (e2 <= dx) // e_xy + e_y < 0
    {
      err += dx;
      y1 += sy;
    }
  }
}
