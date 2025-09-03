"use client";

import Link from "next/link";

export default function SiteNav() {
    return (
        <nav
            className="fixed top-0 z-[100] min-h-16 w-full backdrop-blur-sm transition-all duration-200 ease-linear bg-background/90"
            style={{ padding: "0px max(16px, -800px + 50vw)" }}
        >
            <div className="relative">
                <div className="flex min-h-20 items-center gap-6">
                    <Link aria-label="Lightyear" href="/" className="inline-flex">
                        <span className="h-6 inline-block">Logo</span>
                    </Link>

                    <div className="flex [flex:1_0_auto]" />

                    <div className="max-tablet:hidden flex items-center gap-2">
                        <Link href="/" className="m-1 inline-flex rounded-full px-2 py-1.5 text-title-small">
                            Personal
                        </Link>
                        <Link href="/en-eu/business" className="m-1 inline-flex rounded-full px-2 py-1.5 text-title-small">
                            Business
                        </Link>
                        <Link href="/en-eu/pricing" className="m-1 inline-flex rounded-full px-2 py-1.5 text-title-small">
                            Pricing
                        </Link>
                        <Link href="/en-eu/about" className="m-1 inline-flex rounded-full px-2 py-1.5 text-title-small">
                            About
                        </Link>
                    </div>

                    <div className="flex gap-2">
                        <Link href="/en-eu/login" className="h-10 px-4 inline-flex items-center rounded-full">
                            Log in
                        </Link>
                        <Link href="/en-eu/signup" className="h-10 px-4 inline-flex items-center rounded-full">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
