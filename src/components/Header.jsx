import Link from "next/link";
import HeaderLogo from "./HeaderLogo";

const navLinkBase = "m-1 h-10 px-4 inline-flex items-center justify-center rounded-full py-1.5 text-title-small text-sm font-semibold transition-all duration-500 hover:bg-indigo-50";

export default function Header() {
    return (
        <nav className="fixed top-0 left-0 z-[100] w-full min-h-16 backdrop-blur-sm transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0,1)] px-[max(16px,calc((100vw-1600px)/2))]">
            <div className="relative flex min-h-20 items-center gap-6 justify-between">
                <HeaderLogo />

                <div className="hidden md:flex flex-1 items-center gap-3">
                    <Link href="/" className={navLinkBase}>Home</Link>
                    <Link href="/donation" className={navLinkBase}>Donation</Link>
                    <Link href="/donation-v1" className={navLinkBase}>Donation-v1</Link>
                </div>


                <div className="flex gap-2 ">
                    <Link href="/"
                          className="h-10 px-4 inline-flex items-center rounded-full bg-indigo-50 text-indigo-900 text-sm font-semibold">
                        Donation
                    </Link>
                    <Link href="/donation"
                          className="h-10 px-4 inline-flex items-center rounded-full bg-indigo-700 text-white text-sm font-semibold">
                        Donation
                    </Link>
                </div>
            </div>
        </nav>
    );
}
