import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Shivprasad | Full Stack Developer",
  description: "Personal portfolio of Shivprasad, showcasing projects, open source contributions, and skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-bg-primary text-text-primary" suppressHydrationWarning>
        <SmoothScroll>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
