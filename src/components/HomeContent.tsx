import { useEffect, useState } from "react";

export default function HomeContent() {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    fetch("/home.txt")
      .then((res) => res.text())
      .then((data) => setLines(data.split(/\r?\n/).filter(line => line.trim() !== "")));
  }, []);

  return (
    <div>
      {lines.map((line, idx) => (
        <p key={idx} className="mb-5">{line}</p>
      ))}
    </div>
  );
}
