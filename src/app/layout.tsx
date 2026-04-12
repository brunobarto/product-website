import "./globals.css";
import type { Metadata } from "next";
import { NavBar } from "@/components/NavBar";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Vinyl Mac Store",
  description: "Old Macintosh-style vinyl ecommerce store"
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  await auth(); // initialize auth on server

  return (
    <html lang="en">
      <body className="p-4">
        <NavBar />
        {children}
      </body>
    </html>
  );
}
