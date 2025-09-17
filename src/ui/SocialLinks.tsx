import { Github, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

export default function SocialLinks() {
  return (
    <nav aria-label="Social" className="pb-4">
      <ul className="flex gap-3 justify-end">
        <li>
          <Link href="https://github.com/kiwirm" aria-label="GitHub" className="hover-fg-secondary">
            <Github />
          </Link>
        </li>
        <li>
          <Link href="https://instagram.com/k1wirm" aria-label="Instagram" className="hover-fg-secondary">
            <Instagram />
          </Link>
        </li>
        <li>
          <Link href="https://linkedin.com/in/kiwirm" aria-label="LinkedIn" className="hover-fg-secondary">
            <Linkedin />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
