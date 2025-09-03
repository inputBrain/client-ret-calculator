"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();

    return (
        <header className="border-b">
            <div className="container mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
                <Link href="/public" className="font-semibold">Next Calculator</Link>
                <nav className="flex items-center gap-4 text-sm">
                    <Link href="/public" className={pathname === "/" ? "font-semibold" : ""}>Home</Link>
                    <Link href="/donation-v1" className={pathname?.startsWith("/donation-v1") ? "font-semibold" : ""}>Donation</Link>
                </nav>
            </div>
        </header>
    );
}
