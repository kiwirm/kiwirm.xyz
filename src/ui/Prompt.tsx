"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Prompt() {
  const pathname = usePathname();
  return (
    <span className="inline-block">
      <span className="md:inline" suppressHydrationWarning={true}>
        Last login: {new Date().toString().slice(0, 24)} on ttys000
      </span>
      <br />
      <Link href="/">
        <span className="green">root@kiwirm.xyz</span>
        <span className="blue">~{pathname !== "/" && pathname}</span>$
      </Link>
    </span>
  );
}
