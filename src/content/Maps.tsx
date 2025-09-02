import Link from "next/link";

import { Map } from "../types/types";

export default function Maps({
  maps,
  setHovered,
}: {
  maps: Map[];
  setHovered: (name: string | null) => void;
}) {
  return (
    <table className="w-full table-auto">
      <thead>
        <tr>
          <th className="font-normal text-left green">map</th>
          <th className="font-normal text-left green pr-4">client</th>
          <th className="font-normal text-left green pr-4">event</th>
          <th className="font-normal text-left green hidden md:table-cell pr-4">
            km^2
          </th>
          <th className="font-normal text-left green  hidden md:table-cell pr-4">
            hours
          </th>
          <th className="font-normal text-left green hidden md:table-cell  pr-4">
            terrain
          </th>
        </tr>
      </thead>
      <tbody>
        {maps.map((omap) => (
          <tr
            key={omap.name}
            onMouseEnter={() => setHovered(omap.name)}
            onMouseLeave={() => setHovered(null)}
          >
            <td className="pr-4 align-top">
              <Link
                href={`/maps/${omap.name.replace(/(\.ocd|\.zip)$/, "")}`}
                className="blue underline font-semibold"
              >
                {omap.name}
              </Link>
            </td>
            <td className="pr-4 align-top yellow">{omap.client}</td>
            <td className="pr-4 align-top">{omap.event}</td>
            <td className="pr-4 align-top hidden md:table-cell ">
              {omap.size}
            </td>
            <td className="pr-4 align-top hidden md:table-cell">
              {omap.hours}
            </td>
            <td className="pr-4 align-top hidden md:table-cell">
              {omap.terrain}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
