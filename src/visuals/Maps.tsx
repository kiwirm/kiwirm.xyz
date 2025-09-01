import proj4 from "proj4";
import { useMemo } from "react";

import { Map } from "../types/types";

import NZ from "../assets/NZ";

const CANVAS_SIZE = 256;

const SVG_EXTENT_NZTM = {
  xmin: 500000,
  xmax: 2500000,
  ymin: 4500000,
  ymax: 6500000,
};

const NZTM = [
  "+proj=tmerc",
  "+lat_0=0 +lon_0=173",
  "+k=0.9996",
  "+x_0=1600000 +y_0=10000000",
  "+ellps=GRS80",
  "+units=m",
].join(" ");
const WGS84 = "EPSG:4326";

const wgs2svg = ([lon, lat]: [number, number]) => {
  const [x, y] = proj4(WGS84, NZTM, [lon, lat]);
  const xrel =
    (x - SVG_EXTENT_NZTM.xmin) / (SVG_EXTENT_NZTM.xmax - SVG_EXTENT_NZTM.xmin);
  const yrel =
    (SVG_EXTENT_NZTM.ymax - y) / (SVG_EXTENT_NZTM.ymax - SVG_EXTENT_NZTM.ymin);
  return [xrel * CANVAS_SIZE, yrel * CANVAS_SIZE];
};

export default function MapsVisual({
  maps,
  hovered,
}: {
  maps: Map[];
  hovered: string | null;
}) {
  const svgSize = 256;

  const locations = useMemo(() => {
    return maps.map((map) => {
      const [x, y] = wgs2svg([map.location.lon, map.location.lat]);
      return { name: map.name, x, y };
    });
  }, [maps]);

  return (
    <div className="relative w-full flex justify-center items-center">
      <NZ />
      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        className="absolute pointer-events-none"
      >
        {locations
          .filter((location) => location.name !== hovered)
          .map((location) => (
            <circle
              key={location.name}
              cx={location.x}
              cy={location.y}
              r="var(--radius-primary)"
              fill="var(--color-blue)"
              stroke="none"
              strokeWidth="var(--stroke-node-hover)"
            />
          ))}
        {locations
          .filter((location) => location.name === hovered)
          .map((location) => (
            <circle
              key={location.name}
              cx={location.x}
              cy={location.y}
              r="var(--radius-primary)"
              fill="var(--color-blue)"
              stroke="var(--color-fg)"
              strokeWidth="var(--stroke-node-hover)"
            />
          ))}
      </svg>
    </div>
  );
}
