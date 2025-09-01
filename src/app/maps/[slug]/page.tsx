import fs from "fs";
import { notFound } from "next/navigation";
import path from "path";

export default function MapPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = params as any;
  const mapsPath = path.join(process.cwd(), "public/maps.json");
  const maps = JSON.parse(fs.readFileSync(mapsPath, "utf8"));
  const map = maps.find((m: any) => m.name.replace(/\.ocd$/, "") === slug);
  if (!map) return notFound();

  const imagesDir = path.join(process.cwd(), "public/images", slug);
  const images = fs.readdirSync(imagesDir);

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
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8">
          {images.map((img) => (
            <img
              key={img}
              src={`/images/${slug}/${img}`}
              alt={map.name}
              className="object-cover w-full h-40 sm:h-48 md:h-56"
              loading="lazy"
            />
          ))}
        </div>
      )}
    </main>
  );
}
