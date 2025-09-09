import Link from "next/link";
import Logo from "@/components/Logo";

const navLinkBase = "m-1 h-10 px-4 inline-flex items-center justify-center rounded-full py-1.5 text-title-small text-sm font-semibold transition-all duration-500 hover:bg-indigo-50";

export default function Nav() {
    return (
        <nav className="fixed top-0 left-0 z-[100] w-full min-h-16 backdrop-blur-sm transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0,1)] px-[max(16px,calc((100vw-1600px)/2))]">
            <div className="relative flex min-h-20 items-center gap-6 justify-between">
                <Logo />

                <div className="hidden md:flex flex-1 items-center gap-3">
                    <Link href="/" className={navLinkBase}>Personal</Link>
                    <Link href="/en-eu/business" className={navLinkBase}>Business</Link>
                    <Link href="/en-eu/pricing" className={navLinkBase}>Pricing</Link>
                    <Link href="/en-eu/about" className={navLinkBase}>About</Link>
                </div>

                {/* кнопки справа */}
                <div className="flex gap-2">
                    <Link href="/en-eu/login"
                          className="h-10 px-4 inline-flex items-center rounded-full bg-indigo-50 text-indigo-900 text-sm font-semibold">
                        Log in
                    </Link>
                    <Link href="/signup"
                          className="h-10 px-4 inline-flex items-center rounded-full bg-indigo-700 text-white text-sm font-semibold">
                        Sign up
                    </Link>
                </div>
            </div>
        </nav>
    );
}
