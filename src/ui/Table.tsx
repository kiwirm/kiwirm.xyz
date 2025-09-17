"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { TableData } from "../types/types";

interface TableProps {
  table: TableData;
  setHovered: (key: string | null) => void;
  hovered: string | null;
  setHoveredRelation?: (key: string | null) => void;
  hoveredRelation?: string | null;
}

export default function Table({
  table,
  setHovered,
  hovered,
  setHoveredRelation,
  hoveredRelation,
}: TableProps) {
  const router = useRouter();
  return (
    <table>
      <thead>
        <tr>
          <th className="font-normal text-left green">{table.name}</th>
          <th className="font-normal text-left green hidden md:table-cell">{table.relationName}</th>
          {Object.keys(table.rows[0].data).map((key) => (
            <th key={key} className="font-normal text-left green pr-4">
              {key}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.rows.map((row) => (
          <tr
            key={row.key}
            onMouseEnter={() => setHovered(row.key)}
            onMouseLeave={() => setHovered(null)}
          >
            <td className="pr-4 align-top relative">
              <span
                className={`absolute top-0 bottom-0 -left-6 ${hovered === row.key
                  ? "w-stroke-node-hover bg-fg"
                  : ""
                  }`}
              />
              <Link
                href={row.url ? row.url : `/${table.name}/${row.key}`}
                className={`font-semibold ${hovered === row.key ? "blue-secondary underline" : "blue"
                  }`}
              >
                {row.key}
              </Link>
            </td>
            <td className="pr-4 align-top hidden md:table-cell">
              {Object.entries(row.relations).map(([key, url]) =>
                url ? (
                  <a
                    key={key}
                    href={url}
                    onMouseEnter={() => setHoveredRelation?.(key)}
                    onMouseLeave={() => setHoveredRelation?.(null)}
                    className={`cursor-pointer mr-3 ${hoveredRelation === key
                      ? "underline yellow-secondary"
                      : "yellow"
                      }`}
                  >
                    {key}
                  </a>
                ) : (
                  <span
                    key={key}
                    onMouseEnter={() => setHoveredRelation?.(key)}
                    onMouseLeave={() => setHoveredRelation?.(null)}
                    className={`cursor-pointer mr-3 ${hoveredRelation === key
                      ? "underline yellow-secondary"
                      : "yellow"
                      }`}
                  >
                    {key}
                  </span>
                )
              )
              }
            </td>
            {Object.entries(row.data).map(([k, v]) => (
              <td className="align-top" key={k}>
                {v}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
