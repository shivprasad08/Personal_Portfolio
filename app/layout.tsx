import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

const BASE_URL = "https://shivprasadportfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Shivprasad | Full Stack Developer",
    template: "%s | Shivprasad",
  },

  description:
    "Full Stack Developer specializing in MERN stack, Next.js, and AI/ML. " +
    "Building scalable web applications and open source tools from Pimpri, Maharashtra.",

  keywords: [
    "Shivprasad",
    "Shivprasad Mahind",
    "Full Stack Developer",
    "MERN Stack Developer",
    "Next.js Developer",
    "React Developer",
    "Node.js Developer",
    "Python Developer",
    "Open Source Contributor",
    "Web Developer India",
    "Software Engineer Pune",
    "Portfolio",
  ],

  authors: [{ name: "Shivprasad Mahind", url: BASE_URL }],
  creator: "Shivprasad Mahind",
  publisher: "Shivprasad Mahind",

  // Canonical URL
  alternates: {
    canonical: BASE_URL,
  },

  // Open Graph — controls LinkedIn, WhatsApp, Facebook previews
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "Shivprasad | Portfolio",
    title: "Shivprasad | Full Stack Developer",
    description:
      "Full Stack Developer specializing in MERN stack, Next.js, and AI/ML. " +
      "Building scalable web apps and open source tools.",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "Shivprasad — Full Stack Developer Portfolio",
      },
    ],
    locale: "en_IN",
  },

  // Twitter / X card
  twitter: {
    card: "summary_large_image",
    title: "Shivprasad | Full Stack Developer",
    description:
      "MERN Stack · Next.js · AI/ML · Open Source. Check out my portfolio.",
    site: "@Shivprasad_08",
    creator: "@Shivprasad_08",
    images: ["/og"],
  },

  // Favicon chain
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",      // 180×180px
    shortcut: "/favicon.ico",
  },

  manifest: "/site.webmanifest",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    google: "YOUR_VERIFICATION_CODE_HERE",  // replaced from Search Console by user later if needed
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-bg-primary text-text-primary" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Shivprasad Mahind",
              url: "https://shivprasadportfolio.vercel.app",
              image: "https://github.com/shivprasad08.png",
              sameAs: [
                "https://github.com/shivprasad08",
                "https://www.linkedin.com/in/shivprasad-mahind08/",
                "https://x.com/Shivprasad_08",
              ],
              jobTitle: "Full Stack Developer",
              worksFor: {
                "@type": "Organization",
                name: "Open Source / Freelance",
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Pimpri",
                addressRegion: "Maharashtra",
                addressCountry: "IN",
              },
              email: "shivprasad.mahind@gmail.com",
              knowsAbout: [
                "JavaScript", "TypeScript", "React", "Next.js",
                "Node.js", "MongoDB", "Python", "Docker", "AWS",
                "LangChain", "RAG", "Full Stack Development",
              ],
            }),
          }}
        />
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
