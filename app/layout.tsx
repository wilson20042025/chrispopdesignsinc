import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chris Pop Design Innovation | Architecture and 3D Fabrication..",
  description: "We bridge the gap between architectural design and 3D fabrication, creating innovative spaces that are as functional as they are beautiful.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased font-inter scroll-smooth`}
    >
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="selection:bg-primary-container selection:text-on-primary-container">
        {children}
      </body>
    </html>
  );
}
