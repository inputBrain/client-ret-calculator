import Image from "next/image";
import Link from "next/link";

export default function Logo() {
    return (
        <Link
            href="/"
            className="inline-flex focus-visible:outline-none focus-visible:[&_img]:outline-2 focus-visible:[&_img]:outline-content-interactive-tertiary"
            aria-label="Logo"
        >
            <Image
                src="/next.svg"
                alt="Logo"
                width={96}
                height={24}
                className="h-6 w-auto cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0,1)]"
                priority
            />
        </Link>
    );
}
