import Link from "next/link";

export default function Prompt() {
  return (
    <span className="inline-block">
      <span className="md:inline" suppressHydrationWarning={true}>
        Last login: {new Date().toString().slice(0, 24)} on ttys000
      </span>
      <br />
      <Link href="/">
        <span className="green">root@kiwirm.xyz</span>
        <span className="blue">~</span>$
      </Link>
    </span>
  );
}
