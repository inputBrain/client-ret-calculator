import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/footer";
import VwVhProvider from "@/components/VwVhProvider";

export const metadata: Metadata = {
    title: "App",
    description: "…",
};

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <VwVhProvider />
        <Nav />
        <div className="w-full pt-20">
            <main className="container mx-auto w-full max-w-6xl flex-1 px-4">{children}</main>

        </div>
        {/*<Footer />*/}
        </body>
        </html>
    );
}
