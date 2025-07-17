"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";

const GRID_SIZE = 32;
const GAUSSIAN_STDDEV = 4;
const CANVAS_SIZE = 256;
const NOISE_THRESHOLD = 0.3;
const CURSOR_SENSITIVITY = 2;
const PERLIN_RESOLUTION = 6;

const perlin3d = (x: number, y: number, z: number, perm: Uint8Array) => {
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a: number, b: number, t: number) => a + t * (b - a);
  const grad = (hash: number, x: number, y: number, z: number) => {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  };
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const Z = Math.floor(z) & 255;
  x -= Math.floor(x);
  y -= Math.floor(y);
  z -= Math.floor(z);
  const u = fade(x);
  const v = fade(y);
  const w = fade(z);
  const A = perm[X] + Y;
  const AA = perm[A] + Z;
  const AB = perm[A + 1] + Z;
  const B = perm[X + 1] + Y;
  const BA = perm[B] + Z;
  const BB = perm[B + 1] + Z;
  return lerp(
    lerp(
      lerp(grad(perm[AA], x, y, z), grad(perm[BA], x - 1, y, z), u),
      lerp(grad(perm[AB], x, y - 1, z), grad(perm[BB], x - 1, y - 1, z), u),
      v
    ),
    lerp(
      lerp(
        grad(perm[AA + 1], x, y, z - 1),
        grad(perm[BA + 1], x - 1, y, z - 1),
        u
      ),
      lerp(
        grad(perm[AB + 1], x, y - 1, z - 1),
        grad(perm[BB + 1], x - 1, y - 1, z - 1),
        u
      ),
      v
    ),
    w
  );
};

const gaussian = (x: number, y: number) => {
  const dx = x - (GRID_SIZE - 1) / 2;
  const dy = y - (GRID_SIZE - 1) / 2;
  return Math.exp(-(dx * dx + dy * dy) / (2 * (GRID_SIZE / GAUSSIAN_STDDEV) ** 2));
};

const PIXEL_SIZE = CANVAS_SIZE / GRID_SIZE;
const createPerms = () => {
  const perm = new Uint8Array(512);
  for (let i = 0; i < 256; i++) perm[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  for (let i = 0; i < 256; i++) perm[i + 256] = perm[i];
  return perm;
};

const drawPerlinArt = (svg: any, perm: Uint8Array, z: number) => {
  svg.selectAll("rect").remove();
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const noise = perlin3d(x / PERLIN_RESOLUTION, y / PERLIN_RESOLUTION, z, perm);
      const normalizedNoise = (noise + 1) / 2;
      const gaussianWeight = gaussian(x, y);
      const pixelValue = normalizedNoise * gaussianWeight;
      if (pixelValue < NOISE_THRESHOLD) continue;
      svg
        .append("rect")
        .attr("x", x * PIXEL_SIZE)
        .attr("y", y * PIXEL_SIZE)
        .attr("width", PIXEL_SIZE)
        .attr("height", PIXEL_SIZE)
        .attr("fill", "var(--color-fg)")
        .attr("opacity", pixelValue);
    }
  }
};

const getZFromCursor = (e: MouseEvent) => {
  const x = e.clientX;
  const y = e.clientY;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  return x / screenWidth + y / screenHeight / 2;
};

const PerlinArt = () => {
  const d3Container = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(d3Container.current);
    svg.selectAll("*").remove();
    svg.attr("width", CANVAS_SIZE).attr("height", CANVAS_SIZE);
    const perm = createPerms();
    let z = 0;
    let running = true;

    const handleMouseMove = (e: MouseEvent) => {
      z = getZFromCursor(e);
      drawPerlinArt(svg, perm, z * CURSOR_SENSITIVITY);
    };

    drawPerlinArt(svg, perm, z);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      running = false;
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <svg ref={d3Container} />;
};

export default PerlinArt;
