import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "ECO-WARRIOR — Zero Waste Climate War", description: "Turn real-world climate actions into impact, reputation and rewards." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
