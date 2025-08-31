import { notFound } from "next/navigation";
import path from "path";
import fs from "fs";

export default function MapPage({ params }: { params: { slug: string } }) {
  const mapsPath = path.join(process.cwd(), "public/maps.json");
  const maps = JSON.parse(fs.readFileSync(mapsPath, "utf8"));
  const map = maps.find(
    (m: any) => m.name.replace(/\.ocd$/, "") === params.slug
  );
  if (!map) return notFound();

  return (
    <main className="ml-10 sm:ml-28">
      <h1 className="">{map.name}</h1>
      <p className="mb-2 text-lg">{map.description}</p>
      <div className="mb-4">
        <span className="font-semibold">Size:</span> {map.size} km²
      </div>
      <div className="mb-4">
        <span className="font-semibold">Hours:</span> {map.hours}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Terrain:</span> {map.terrain}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Location:</span> {map.location.lat},{" "}
        {map.location.lon}
      </div>
    </main>
  );
}
