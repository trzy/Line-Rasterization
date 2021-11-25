# Interactive Line Rasterization and Grid Traversal Demo

*Copyright 2021 Bart Trzynadlowski*

An interactive HTML5 demo showing a few different methods for line plotting or discrete grid traversal:

- [Bresenham's line algorithm](https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm): Widely used for drawing lines on raster displays.
- An exact method implemented by me that captures all points the line passes through, suitable for traversing a grid or voxel map.
- [Amanatides-Woo voxel traversal algorithm](http://www.cse.yorku.ca/~amana/research/grid.pdf) in 2D: A fast traversal algorithm that yields the same results as the exact method.

Try it here: [https://trzy.org/line_rasterization](https://trzy.org/line_rasterization)