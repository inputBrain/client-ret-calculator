"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";

export type ShareMenuProps = {
    /** Явно передать ссылку. Если не передать — возьмём window.location.href на клиенте */
    url?: string;
    /** Заголовок/текст для нативного share и твита */
    title?: string;
    text?: string;
    /** Кнопка-children (по умолчанию — простая кнопка) */
    trigger?: (args: { onClick: () => void; "aria-expanded": boolean }) => React.ReactNode;
    /** Колбек на успешное копирование */
    onCopied?: () => void;
    /** Закрывать меню при уходе мыши (по умолчанию true) */
    closeOnMouseLeave?: boolean;
};

function useSafeUrl(explicit?: string) {
    const [href, setHref] = useState<string>("");
    useEffect(() => {
        if (explicit) { setHref(explicit); return; }
        if (typeof window !== "undefined") setHref(window.location.href);
    }, [explicit]);
    return href;
}

export default function ShareMenu({
    url,
    title = "My FIRE projection",
    text = "Check out my FIRE projection",
    trigger,
    onCopied,
    closeOnMouseLeave = true,
}: ShareMenuProps) {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const href = useSafeUrl(url);
    // const urlEnc = useMemo(() => encodeURIComponent(href || ""), [href]);
    const urlEnc = typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "";
    const textEnc = useMemo(() => encodeURIComponent(text), [text]);

    // соц-ссылки
    const tgHref = `https://t.me/share/url?url=${urlEnc}&text=${textEnc}`;
    const waHref = `https://wa.me/?text=${textEnc}%20${urlEnc}`;
    const twHref = `https://twitter.com/intent/tweet?url=${urlEnc}&text=${textEnc}`;
    const liHref = `https://www.linkedin.com/sharing/share-offsite/?url=${urlEnc}`;

    const handleCopy = async () => {
        try {
            const toCopy = href;
            if (!toCopy) return;
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(toCopy);
            } else {
                // фолбэк через временное textarea
                const ta = document.createElement("textarea");
                ta.value = toCopy;
                ta.style.position = "fixed";
                ta.style.opacity = "0";
                document.body.appendChild(ta);
                ta.select();
                document.execCommand("copy");
                document.body.removeChild(ta);
            }
            setCopied(true);
            setOpen(false);
            onCopied?.();
            setTimeout(() => setCopied(false), 2000);
        } catch (e) {
            console.error("Copy failed", e);
        }
    };

    const handleNativeShare = async () => {
        try {
            if (navigator.share && href) {
                await navigator.share({ title, text, url: href });
            } else {
                await handleCopy();
            }
            setOpen(false);
        } catch {
            setOpen(false);
        }
    };

    return (
        <div className="relative inline-block">
            {trigger ? (
                trigger({ onClick: () => setOpen(v => !v), "aria-expanded": open })
            ) : (
                <button
                    onClick={() => setOpen(v => !v)}
                    aria-expanded={open}
                    className="rounded-full px-4 py-2 text-sm font-semibold text-indigo-800 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 active:translate-y-[1px] transition"
                >
                    Share
                </button>
            )}

            {open && (
                <div
                    className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-[0_10px_30px_-1px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.04)] z-20"
                    onMouseLeave={closeOnMouseLeave ? () => setOpen(false) : undefined}
                    role="menu"
                >
                    <button
                        onClick={handleNativeShare}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-slate-700 hover:bg-slate-50"
                        role="menuitem"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                            <path d="M7 7h10M12 7v10M7 17h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                        Native Share
                    </button>

                    <a href={tgHref} target="_blank" rel="noreferrer"
                       className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50" role="menuitem"
                       onClick={() => setOpen(false)}>
                        <Image src="/social-icons/tg-icon.png" alt="Telegram" width={20} height={20} className="h-5 w-5 object-contain" />
                        Telegram
                    </a>

                    <a href={waHref} target="_blank" rel="noreferrer"
                       className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50" role="menuitem"
                       onClick={() => setOpen(false)}>
                        <Image src="/social-icons/whatsup-icon.png" alt="WhatsApp" width={20} height={20} className="h-5 w-5 object-contain" />
                        WhatsApp
                    </a>

                    <a href={twHref} target="_blank" rel="noreferrer"
                       className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50" role="menuitem"
                       onClick={() => setOpen(false)}>
                        <Image src="/social-icons/twitter-icon.png" alt="X (Twitter)" width={20} height={20} className="h-5 w-5 object-contain" />
                        X (Twitter)
                    </a>

                    <a href={liHref} target="_blank" rel="noreferrer"
                       className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50" role="menuitem"
                       onClick={() => setOpen(false)}>
                        <Image src="/social-icons/linkedin-icon.png" alt="LinkedIn" width={20} height={20} className="h-5 w-5 object-contain" />
                        LinkedIn
                    </a>

                    <button
                        onClick={handleCopy}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-slate-700 hover:bg-slate-50"
                        role="menuitem"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.6"/>
                            <rect x="4" y="4" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.6"/>
                        </svg>
                        Copy link
                    </button>
                </div>
            )}

            {/* Toast */}
            {copied && (
                <div className="fixed bottom-6 right-6 rounded-full bg-slate-900 text-white px-4 py-2 text-sm shadow-lg">
                    Link copied
                </div>
            )}
        </div>
    );
}
