import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "../components/ThemeProvider";

export const metadata: Metadata = {
  title: "root@kiwirm.xyz",
  description: "Personal website of Ryan Moore",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ThemeProvider>
        <body className="bg">{children}</body>
      </ThemeProvider>
    </html>
  );
}
