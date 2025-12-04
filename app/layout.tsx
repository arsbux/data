import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fast Data - Real-time Web Analytics",
  description: "Easy-to-use web analytics platform for tracking website traffic",
  icons: {
    icon: '/logo.png',
  },
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
