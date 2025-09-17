"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Prompt() {
  const pathname = usePathname();
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    setNow(new Date().toString().slice(0, 24));
  }, []);

  return (
    <p className="inline-block">
      <span className="md:inline" suppressHydrationWarning={true}>
        {now && (<>
          Last login: <time dateTime={new Date(now).toISOString()}>{now}</time> on ttys000
        </>)}
      </span>
      <br />
      <Link href="/">
        <strong className="green hover:text-green-secondary hover:underline">root@kiwirm.xyz</strong>
      </Link>
      <span className="blue">~{pathname !== "/" && pathname}</span>$
    </p>
  );
}
