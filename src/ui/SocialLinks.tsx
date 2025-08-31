import Link from "next/link";
import { Github, Instagram, Linkedin } from "lucide-react";

export default function SocialLinks() {
  return (
    <div className="flex gap-3 pb-4 justify-end">
      <Link href="https://github.com/kiwirm" aria-label="GitHub">
        <Github />
      </Link>
      <Link href="https://instagram.com/_r.code" aria-label="Instagram">
        <Instagram />
      </Link>
      <Link href="https://linkedin.com/in/kiwirm" aria-label="LinkedIn">
        <Linkedin />
      </Link>
    </div>
  );
}
