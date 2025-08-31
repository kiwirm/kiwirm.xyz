import "../styles/globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "../ui/ThemeProvider";
import SocialLinks from "../ui/SocialLinks";
import ThemeSelector from "../ui/ThemeSelector";
import Prompt from "../ui/Prompt";

export const metadata: Metadata = {
  title: "root@kiwirm.xyz",
  description: "ryan moore - personal website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ThemeProvider>
        <body className="bg font-fira-code font-mono max-w-screen-lg relative fg my-16 mr-10">
          <div className="static right-16 top-16 lg:fixed mb-5">
            <SocialLinks />
            <ThemeSelector />
          </div>
          <div className="mb-6 ml-10 sm:ml-28">
            <Prompt />
          </div>
          {children}
        </body>
      </ThemeProvider>
    </html>
  );
}
