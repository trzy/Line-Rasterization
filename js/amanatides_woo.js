/*
 * amanatides_woo.js
 * Bart Trzynadlowski, 2021
 *
 * Plots every discrete grid cell that the line passes through using the
 * Amanatides-Woo method described here:
 *
 *  A Fast Voxel Traversal Algorithm for Ray Tracing
 *  John Amanatides, Andrew Woo
 *  http://www.cse.yorku.ca/~amana/research/grid.pdf
 *
 * Thanks to Richard Mitton for pointing me to this.
 */

function plotLineAmanatidesWoo(grid, width, height, x1, y1, x2, y2)
{
  // Ray: u + v*t
  var ux = x1;
  var uy = y1;
  var vx = x2 - x1;
  var vy = y2 - y1;

  // Integral starting indices in grid (the initial pixel)
  var x = Math.floor(ux + 0.5);
  var y = Math.floor(uy + 0.5);

  // Integral step increments
  var stepX = Math.sign(vx);
  var stepY = Math.sign(vy);

  // Integral ending indices in grid: one step beyond the final pixel
  var xEnd = Math.floor(x2 + 0.5) + stepX;
  var yEnd = Math.floor(y2 + 0.5) + stepY;

  // Values of t at which ray crosses the vertical and horizontal boundaries of
  // the initial pixel. To compute e.g. the first vertical boundary, solve for t
  // where: ux + vx * t = (x + 0.5 * stepX) -> t = ((x + 0.5 * stepX) - ux) / vx
  var tMaxX = ((x + 0.5 * stepX) - ux) / vx;
  var tMaxY = ((y + 0.5 * stepY) - uy) / vy;

  // Compute change in t required to move exactly one pixel horizontally and
  // vertically: ux + vx * dt = ux + stepX -> dt = stepX / vx
  var tDeltaX = stepX / vx;
  var tDeltaY = stepY / vy;

  do
  {
    grid[y * width + x] = true;
    if (tMaxX < tMaxY)
    {
      x += stepX;
      tMaxX += tDeltaX;
    }
    else
    {
      y += stepY;
      tMaxY += tDeltaY;
    }
  } while (x != xEnd && y != yEnd);
}