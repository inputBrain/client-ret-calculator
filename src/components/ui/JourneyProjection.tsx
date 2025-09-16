"use client";

import React, { useMemo, useState } from "react";
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Dot
} from "recharts";

type Row = {
    yearIdx: number;
    age: number;
    depositStart: number;
    contribYear: number;
    interestYear: number;
    totalEnd: number;
};

export type JourneyProjectionProps = {
    currencySymbol: string;
    kpi: { target: number; retireAge: number; annualSavings: number };
    rows: Row[];
};

const card =
    "rounded-2xl border border-gray-100 bg-white shadow-[0_10px_30px_-1px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.04)]";

const fmt = (v: number, sym: string) =>
    `${sym}${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function JourneyProjection({ currencySymbol, kpi, rows }: JourneyProjectionProps) {
    const [tab, setTab] = useState<"chart" | "table">("chart");

    // share ui state
    const [shareOpen, setShareOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setShareOpen(false);
            setTimeout(() => setCopied(false), 2000);
        } catch (e) {
            console.error(e);
        }
    };

    const handleNativeShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: "My FIRE projection",
                    text: "\nWebsite share",
                    url: window.location.href,
                });
            } else {
                // если нет поддержки — просто копируем
                await handleCopy();
            }
            setShareOpen(false);
        } catch {
            // пользователь мог отменить — просто закрываем меню
            setShareOpen(false);
        }
    };

    const urlEnc = typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "";
    const textEnc = encodeURIComponent("Check out my FIRE projection");

    const tgHref = `https://t.me/share/url?url=${urlEnc}&text=${textEnc}`;
    const waHref = `https://wa.me/?text=${textEnc}%20${urlEnc}`;
    const twHref = `https://twitter.com/intent/tweet?url=${urlEnc}&text=${textEnc}`;
    const liHref = `https://www.linkedin.com/sharing/share-offsite/?url=${urlEnc}`;

    const data = useMemo(
        () =>
            rows.map((r) => ({
                x: `Y${r.yearIdx}`,
                y: Number(r.totalEnd.toFixed(2)),
                age: r.age,
                contrib: r.contribYear,
                growth: r.interestYear,
                start: r.depositStart,
            })),
        [rows]
    );

    return (
        <>
            {/* KPI trio */}
            <div className="grid grid-cols-3 gap-6 text-center mb-4">
                <div>
                    <div className="text-2xl font-semibold text-slate-900">
                        {fmt(kpi.target, currencySymbol)}
                    </div>
                    <div className="text-sm text-slate-600">
                        Your FIRE target
                    </div>
                </div>
                <div>
                    <div className="text-5xl leading-none font-semibold text-slate-900">{kpi.retireAge}</div>
                    <div className="text-sm text-slate-600">Retirement age</div>
                </div>
                <div>
                    <div className="text-2xl font-semibold text-slate-900">
                        {fmt(kpi.annualSavings, currencySymbol)}
                    </div>
                    <div className="text-sm text-slate-600">Annual savings</div>
                </div>
            </div>

            {/* Inner card with tabs */}
            <div className={`${card}  p-4 sm:p-6`}>

                <div className="gap-2 flex flex-col">
                    <div className="text-sm font-semibold uppercase text-indigo-700 text-center">
                        The journey ahead
                    </div>
                    <h5 className="text-2xl font-semibold text-center">
                        Your FIRE projection
                    </h5>
                    <div className="flex items-center justify-center gap-3 text-xs mb-4">
                        <button
                            onClick={() => setTab("chart")}
                            className={`rounded-full px-3 py-1 font-medium ${tab === "chart" ? "bg-indigo-50 text-indigo-800" : "text-slate-600 hover:bg-slate-50"}`}
                        >
                            Chart
                        </button>
                        <button
                            onClick={() => setTab("table")}
                            className={`rounded-full px-3 py-1 font-medium ${tab === "table" ? "bg-indigo-50 text-indigo-800" : "text-slate-600 hover:bg-slate-50"}`}
                        >
                            Table
                        </button>
                    </div>
                </div>


                {tab === "chart" ? (
                    <div className="h-[360px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.25} />
                                        <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.05} />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid stroke="#eef2ff" vertical={false} />
                                <XAxis dataKey="x" tick={{ fontSize: 12, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
                                <YAxis
                                    tickFormatter={(v) => fmt(v, currencySymbol)}
                                    width={90}
                                    tick={{ fontSize: 12, fill: "#64748b" }}
                                    tickLine={false}
                                    axisLine={{ stroke: "#e5e7eb" }}
                                />

                                <Tooltip
                                    cursor={{ stroke: "#c7d2fe", strokeDasharray: 4 }}
                                    content={({ active, payload }) => {
                                        if (!active || !payload?.length) return null;
                                        const p: any = payload[0].payload;
                                        return (
                                            <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-[0_10px_30px_-1px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.04)]">
                                                <div className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 text-sm">
                                                    <div className="text-slate-600">Growth</div>
                                                    <div className="font-medium">{fmt(p.growth, currencySymbol)}</div>
                                                    <div className="text-slate-600">Contributions</div>
                                                    <div className="font-medium">{fmt(p.contrib, currencySymbol)}</div>
                                                    <div className="text-slate-600">Initial lump sum</div>
                                                    <div className="font-medium">{fmt(p.start, currencySymbol)}</div>
                                                </div>
                                                <div className="my-3 h-px bg-gray-100" />
                                                <div className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 text-sm">
                                                    <div className="text-slate-600">Age</div>
                                                    <div className="font-semibold">{p.age}</div>
                                                    <div className="text-slate-600">Total saved</div>
                                                    <div className="font-semibold">{fmt(p.y, currencySymbol)}</div>
                                                </div>
                                            </div>
                                        );
                                    }}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="y"
                                    stroke="#4f46e5"
                                    strokeWidth={2}
                                    fill="url(#fillTotal)"
                                    activeDot={<Dot r={4} stroke="#4f46e5" />}
                                />
                            </AreaChart>
                        </ResponsiveContainer>


                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-separate border-spacing-0 text-sm">
                            <thead>
                            <tr className="text-left text-slate-600">
                                <th className="py-3 px-4 font-medium">End of Year</th>
                                <th className="py-3 px-4 font-medium">Initial deposit</th>
                                <th className="py-3 px-4 font-medium">Annual savings</th>
                                <th className="py-3 px-4 font-medium">Interest earned</th>
                                <th className="py-3 px-4 font-medium">Total value</th>
                            </tr>
                            </thead>
                            <tbody>
                            {rows.map((r, i) => (
                                <tr key={i} className={i % 2 ? "bg-slate-50/60" : ""}>
                                    <td className="py-3 px-4 text-slate-700">
                                        {r.yearIdx} (age {r.age})
                                    </td>
                                    <td className="py-3 px-4">{fmt(r.depositStart, currencySymbol)}</td>
                                    <td className="py-3 px-4">{fmt(r.contribYear, currencySymbol)}</td>
                                    <td className="py-3 px-4">{fmt(r.interestYear, currencySymbol)}</td>
                                    <td className="py-3 px-4 font-medium text-slate-900">
                                        {fmt(r.totalEnd, currencySymbol)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Легенда + Share */}
                <div className="mt-8 mb-10 flex items-start justify-between text-sm font-semibold relative">
                    {/* Легенда */}
                    <div className="flex flex-wrap items-center gap-6 text-slate-700">
                        <div className="inline-flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-indigo-600" />
                            Initial {currencySymbol} 105
                        </div>
                        <div className="inline-flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-violet-600" />
                            Contributions {currencySymbol} 105 p/m
                        </div>
                        <div className="inline-flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-600" />
                            Growth 0.00% p/a
                        </div>
                    </div>

                    {/* Share button + dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShareOpen((v) => !v)}
                            className="rounded-full px-4 py-2 text-sm font-semibold text-indigo-800 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 active:translate-y-[1px] transition"
                        >
                            Share
                        </button>

                        {shareOpen && (
                            <div
                                className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-[0_10px_30px_-1px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.04)]"
                                onMouseLeave={() => setShareOpen(false)}
                            >
                                <button
                                    onClick={handleNativeShare}
                                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-slate-700 hover:bg-slate-50"
                                >
                                    {/* system share icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                                        <path d="M7 7h10M12 7v10M7 17h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                    </svg>
                                    Native Share
                                </button>

                                <a
                                    href={tgHref}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50"
                                    onClick={() => setShareOpen(false)}
                                >
                                    {/* Telegram */}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" className="h-5 w-5">
                                        <path d="M120 0c66.3 0 120 53.7 120 120s-53.7 120-120 120S0 186.3 0 120 53.7 0 120 0z" fill="#2ca5e0"/>
                                        <path d="M178.7 70.7 161 164.3c-1.2 6.2-4.7 7.7-9.5 4.8l-26.3-19.4-12.7 12.2c-1.4 1.4-2.6 2.6-5.3 2.6l1.9-27.3 49.7-44.8c2.2-1.9-.5-3-3.4-1.1l-61.4 38.7-26.5-8.3c-5.8-1.8-5.9-5.8 1.2-8.6l103.6-40.1c4.8-1.8 9 1.1 7.5 8.6z" fill="#fff"/>
                                    </svg>
                                    Telegram
                                </a>

                                <a
                                    href={waHref}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50"
                                    onClick={() => setShareOpen(false)}
                                >
                                    {/* WhatsApp */}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-5 w-5">
                                        <path d="M128 0C57.3 0 0 57.3 0 128c0 22.5 6 43.6 16.4 61.7L0 256l68.3-16.4C86.4 250 107.5 256 130 256c70.7 0 128-57.3 128-128S198.7 0 128 0z" fill="#25D366"/>
                                        <path d="M206.1 183.9c-3.4 9.6-16.8 17.6-27.5 19-7.4 1-16.9 1.8-49-10.4-41.1-16.3-67.7-58.7-69.7-61.4-2-2.7-16.6-22.1-16.6-42.2s10.2-29.9 14.3-34.1c3.4-3.4 9-5 14.3-5 1.7 0 3.2 0.1 4.6 0.1 4 0.2 6 0.4 8.6 6.6 3.4 8.2 11.6 28.3 12.6 30.3 1 2 1.7 4.5 0.3 7.2-1.2 2.4-1.9 3.9-3.7 6-1.9 2.2-3.9 4-5.9 6.5-1.8 2.3-3.7 4.7-1.6 8.9 2.2 4.4 9.6 15.8 20.7 25.6 14.2 12.3 25.9 16.1 30.4 18 4.5 1.9 7.1 1.6 9.7-0.9 3.1-3 7.2-8.3 9.1-11.2 2-2.9 4-2.5 6.7-1.6 2.8 1 17.8 8.4 20.9 9.9 3.1 1.5 5.1 2.3 5.9 3.6 0.8 1.4 0.8 8.2-2.6 17.8z" fill="#fff"/>
                                    </svg>
                                    WhatsApp
                                </a>

                                <a
                                    href={twHref}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50"
                                    onClick={() => setShareOpen(false)}
                                >
                                    {/* X / Twitter */}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" className="h-5 w-5">
                                        <path d="M0 0h300v300H0z" fill="#000"/>
                                        <path d="M180.1 130.5 271 20h-21.6l-78.7 95.3L112.4 20H40l95.8 140.9L40 280h21.6l82.7-100.2L187.6 280H260l-79.9-118.9zM154.5 166.7l-9.6-13.7-76.2-108.1h32.8l61.5 87.3 9.6 13.7 80.3 114.1h-32.8l-65.6-93.3z" fill="#fff"/>
                                    </svg>
                                    X (Twitter)
                                </a>

                                <a
                                    href={liHref}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50"
                                    onClick={() => setShareOpen(false)}
                                >
                                    {/* LinkedIn */}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-5 w-5">
                                        <path d="M0 0h256v256H0z" fill="#0A66C2"/>
                                        <path d="M54 96h36v116H54zM72 44a22 22 0 1 1 0 44 22 22 0 0 1 0-44zm56 52h34v16c6-11 21-20 40-20 43 0 52 26 52 60v64h-36v-56c0-17-1-38-24-38-23 0-28 18-28 37v57h-38V96z" fill="#fff"/>
                                    </svg>
                                    LinkedIn
                                </a>

                                <button
                                    onClick={handleCopy}
                                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-slate-700 hover:bg-slate-50"
                                >
                                    {/* Copy icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.6"/>
                                        <rect x="4" y="4" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.6"/>
                                    </svg>
                                    Copy link
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Toast */}
                {copied && (
                    <div className="fixed bottom-6 right-6 rounded-full bg-slate-900 text-white px-4 py-2 text-sm shadow-lg">
                        Link copied
                    </div>
                )}
            </div>
        </>
    );
}
