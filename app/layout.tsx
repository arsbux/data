import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trackify - Simple Web Analytics",
  description: "Easy-to-use web analytics platform for tracking website traffic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
