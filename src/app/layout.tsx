import type { Metadata } from "next";
import "./globals.css";
// import { Mulish } from "next/font/google";
import Nav from "@/components/Nav";
import VwVhProvider from "@/components/VwVhProvider";
import {Suspense} from "react";

export const metadata: Metadata = {
    title: "Fire Calculator",
    description: "...",
};

export const dynamic = 'force-static';
export const revalidate = false;

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className="antialiased min-h-screen flex flex-col">
        <VwVhProvider />
        <Suspense fallback={null}>
            <Nav />
        </Suspense>
        <div className="w-full pt-20">
            <main className="container mx-auto w-full max-w-6xl flex-1 px-4">{children}</main>

        </div>
        {/*<Footer />*/}
        </body>
        </html>
    );
}
