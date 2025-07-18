import { useState } from "react";

export default function Prompt() {
  const [date] = useState<string>(new Date().toString().slice(0, 24));
  return (
    <span className="inline-block">
      <span className="md:inline">Last login: {date} on ttys000</span>
      <br />
      <span className="green">root@kiwirm.xyz</span>
      <span className="blue">~</span>$
    </span>
  );
}
