import fs from "fs";
import { notFound } from "next/navigation";
import path from "path";
import { Map } from "../../../types/types";

export default function MapPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = params as any;
  const mapsPath = path.join(process.cwd(), "public/content/maps.json");
  const maps: Map = JSON.parse(fs.readFileSync(mapsPath, "utf8"));
  const map = maps.rows.find((m: any) => String(m.key) === slug);
  if (!map) return notFound();

  const imagesDir = path.join(process.cwd(), "public/images", slug);
  const images = fs.readdirSync(imagesDir);

  return (
    <main className="ml-10 sm:ml-28">
      <h1 className="font-semibold">{map.key} | {Object.keys(map.relations)}</h1>
      <br />
      <table>
        <tbody>
          {Object.entries(map.data).map(([key, value]) => (
            <tr key={key}>
              <td className="font-semibold align-top pr-4">{key}</td>
              <td className="align-top">{String(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8">
          {images.map((img) => (
            <img
              key={img}
              src={`/images/${slug}/${img}`}
              alt={map.key}
              className="object-cover w-full h-40 sm:h-48 md:h-56"
              loading="lazy"
            />
          ))}
        </div>
      )}
    </main>
  );
}
