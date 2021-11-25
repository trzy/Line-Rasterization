/*
 * exact.js
 * Bart Trzynadlowski, 2021
 *
 * Plots every discrete grid cell that the line passes through using an exact
 * method.
 */

function isLineInCell(x1, y1, a, b, c)
{
  // https://math.stackexchange.com/questions/2609778/how-to-find-all-squares-over-which-a-line-passes-in-a-finite-squared-tessellatio

  // Compute corner points of grid cell
  centerX = Math.floor(x1 + 0.5);
  centerY = Math.floor(y1 + 0.5);
  cornerX1 = centerX + 0.5;
  cornerY1 = centerY + 0.5;
  cornerX2 = centerX - 0.5;
  cornerY2 = centerY - 0.5;
  cornerX3 = centerX + 0.5;
  cornerY3 = centerY - 0.5;
  cornerX4 = centerX - 0.5;
  cornerY4 = centerY + 0.5;

  // Compute f(x,y) for all corners
  f1 = a * cornerX1 + b * cornerY1 + c;
  f2 = a * cornerX2 + b * cornerY2 + c;
  f3 = a * cornerX3 + b * cornerY3 + c;
  f4 = a * cornerX4 + b * cornerY4 + c;

  // Determine intersection by considering both pairs of corners
  return f1 * f2 <= 0 || f3 * f4 <= 0;
}

// Brute force reference implementation: exact and for infinite line
function plotLineExact2(grid, width, height, x1, y1, x2, y2)
{
  // f(x,y) = a*x + b*y + c, where coefficients computed from two-point form of line
  var a = (y2 - y1) / (x2 - x1);
  var b = -1;
  var c = y1 - (a * x1);

  // Brute force every grid cell
  for (var y = 0; y < height; y++)
  {
    for (var x = 0; x < width; x++)
    {
      if (isLineInCell(x, y, a, b, c))
      {
        // Plot
        grid[y * width + x] = true;
      }
    }
  }
}

// Faster approach: row-by-row, beginning at starting point and then scanning left/right until an intersecting cell is found
// (for the very first row, the first cell will of course be intersecting). Record that point and continue scanning until first
// non-intersecting point is found. Then, advance one row (up/down depending on slope) and begin scanning again at the column
// recorded for the previous row (the line will intersect here or later), repeating the same process as before.
function plotLineExact(grid, width, height, x1, y1, x2, y2)
{
  var a = (y2 - y1) / (x2 - x1);
  var b = -1;
  var c = y1 - (a * x1);

  // Quantize line endpoints so we can step through grid
  x1 = Math.floor(x1 + 0.5);
  y1 = Math.floor(y1 + 0.5);
  x2 = Math.floor(x2 + 0.5);
  y2 = Math.floor(y2 + 0.5);

  // Step increments and limits
  var sx = x1 < x2 ? 1 : -1;
  var sy = y1 < y2 ? 1 : -1;
  var xLimit = x1 < x2 ? (width) : -1;
  var yLimit = y1 < y2 ? (height) : -1;

  // Plot
  var y = y1;
  var prevRowX1 = x1;
  var finished = false;
  while (!finished && y != yLimit)
  {
    // Begin scanning a new row at the x index of the first intersecting grid in the previous row
    var x = prevRowX1;

    // Find first intersecting grid
    x -= sx;
    do
    {
      x += sx;
    } while (x != xLimit && !isLineInCell(x, y, a, b, c));
    prevRowX1 = x;  // remember the x coordinate where the line started on this row

    // Step through all other intersecting grid points on this row
    if (x != xLimit)
    {
      // If we did not hit the limit, we must have found an intersecting grid cell
      var reachedEndpoint = false;
      do
      {
        grid[y * width + x] = true;
        reachedEndpoint = x == x2 && y == y2;
        x += sx;
      } while (x != xLimit && isLineInCell(x, y, a, b, c) && !reachedEndpoint);

      finished = reachedEndpoint;
    }
    else
    {
      // We went to the end of the row without finding an intersection, no point in continuing to other rows
      finished = true;
    }

    // Advance y
    y += sy;
  }
}