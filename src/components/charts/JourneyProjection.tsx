"use client";

import React, { useMemo, useState } from "react";
import {
    AreaChart, Area, Line, XAxis, YAxis, Tooltip,
    CartesianGrid, ResponsiveContainer, Dot, ReferenceLine, Label
} from "recharts";

import Image from "next/image";

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
    kpi: {
        target: number;
        retireAge: number;
        annualSavings: number;
        retireSpanYears?:
            number | null
    };
    rows: Row[];
    goal: number;
    legend: { initial: number;
        contribMonthly: number;
        growthPct: number
    };
    mode?: "withdrawal" | "life";
}

const card = "rounded-2xl border border-gray-100 bg-white shadow-[0_10px_30px_-1px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.04)]";

const fmt = (v: number, sym: string) => `${sym}${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function JourneyProjection({
    currencySymbol,
    kpi,
    rows,
    goal,
    legend,
    mode
}: JourneyProjectionProps)
{
    const [tab, setTab] = useState<"chart" | "table">("chart");

// --- ВМЕСТО твоего data = useMemo(...):
    const fullData = useMemo(() => {
        // rows приходят номинальные totalEnd и номинальные contrib/interest
        // (ниже покажу где их отдать из FireCalculator)
        let contribCum = 0;
        return rows.map((r) => {
            contribCum += r.contribYear; // накопленные взносы к концу года r.yearIdx
            const total = Number(r.totalEnd.toFixed(2));
            const growthCum = Math.max(0, total - legend.initial - contribCum);
            return {
                x: r.yearIdx,
                y: total,                  // итого (номинал)
                age: r.age,
                contribYear: r.contribYear,
                growthYear: r.interestYear,

                contribCum,                // линия Contributions
                growthCum,                 // линия Growth
                initial: legend.initial,   // горизонтальная Initial
            };
        });
    }, [rows, legend.initial]);

    function downsampleToMax<T>(arr: T[], max: number): T[] {
        if (arr.length <= max) return arr;
        const step = (arr.length - 1) / (max - 1);
        return Array.from({ length: max }, (_, i) => arr[Math.round(i * step)]);
    }

// ≤120 точек на графике
    const data = useMemo(() => downsampleToMax(fullData, 120), [fullData]);

// тики каждые 5 лет + первая/последняя
    const ticksEvery5 = useMemo(() => {
        const xs = data.map((d) => d.x);
        const first = xs[0], last = xs[xs.length - 1];
        const t: number[] = [];
        for (const x of xs) {
            if (x === first || x === last || x % 5 === 0) t.push(x);
        }
        return Array.from(new Set(t));
    }, [data]);

// аккуратная плашка Goal
    function GoalPill({ value }: { value: string }) {
        return (
            <Label
                position="insideLeft"
                content={(props) => {
                    const { viewBox } = props as any;
                    const y = viewBox.y;
                    const x = viewBox.x + 8; // небольшой отступ слева
                    const text = `Goal: ${value}`;
                    const w = 10 + text.length * 7; // грубая ширина
                    const h = 22;
                    return (
                        <g transform={`translate(${x},${y - h - 6})`}>
                            <rect width={w} height={h} rx={11} ry={11} fill="#065f46" />
                            <text x={10} y={14} fontSize={12} fill="#ecfdf5">{text}</text>
                        </g>
                    );
                }}
            />
        );
    }


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


    // внутри JourneyProjection, до return
    const retireAgeMeta = useMemo(() => {
        const over = kpi.retireAge > 120;
        if (over && mode !== "life") {
            return { number: "Over 120", subtitle: "Retirement age... R.I.P." };
        }
        if (over && mode === "life") {
            return { number: 120, subtitle: "Retirement age (0 year retirement)" };
        }
        const baseSub =
            mode === "life" && kpi.retireSpanYears != null
                ? `(${kpi.retireSpanYears} year retirement)`
                : "";
        return { number: kpi.retireAge, subtitle: baseSub };
    }, [kpi.retireAge, kpi.retireSpanYears, mode]);

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
                    <div className="text-5xl leading-none font-semibold text-slate-900">
                        {retireAgeMeta.number}
                    </div>
                    <div className="text-sm text-slate-600">
                        {retireAgeMeta.subtitle || "Retirement age"}
                    </div>
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
                    <div className="text-sm font-semibold uppercase text-rose-900 text-center">
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
                                <XAxis
                                    dataKey="x"
                                    ticks={ticksEvery5}
                                    interval={0}
                                    tickFormatter={(v: number) => (v === 0 ? "Y0" : `Y${v}`)}
                                    tick={{ fontSize: 12, fill: "#64748b" }}
                                    tickLine={false}
                                    axisLine={{ stroke: "#e5e7eb" }}
                                />
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
                                                    <div className="font-medium">{fmt(p.growthCum, currencySymbol)}</div>
                                                    <div className="text-slate-600">Contributions</div>
                                                    <div className="font-medium">{fmt(p.contribCum, currencySymbol)}</div>
                                                    <div className="text-slate-600">Initial lump sum</div>
                                                    <div className="font-medium">{fmt(p.initial, currencySymbol)}</div>
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

                                {/* линия цели */}
                                <ReferenceLine
                                    y={goal}
                                    stroke="#10b981"
                                    strokeDasharray="6 6"
                                    label={<GoalPill value={fmt(goal, currencySymbol)} />}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="y"
                                    stroke="#4f46e5"
                                    strokeWidth={2}
                                    fill="url(#fillTotal)"
                                    dot={{ r: 2 }}
                                    activeDot={{ r: 4 }}
                                />

                                <Line type="monotone" dataKey="initial"     stroke="#3b82f6" strokeDasharray="4 4" dot={false} />
                                <Line type="monotone" dataKey="contribCum"  stroke="#8b5cf6" strokeDasharray="4 4" dot={{ r: 1.5 }} />
                                <Line type="monotone" dataKey="growthCum"   stroke="#10b981" strokeDasharray="4 4" dot={{ r: 1.5 }} />
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
                    <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs">
                        <div>• Initial {fmt(legend.initial, currencySymbol)}</div>
                        <div>• Contributions {fmt(legend.contribMonthly, currencySymbol)} p/m</div>
                        <div>• Growth {legend.growthPct.toFixed(2)}% p/a</div>
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
                                    <Image
                                        src="/social-icons/tg-icon.png"
                                        alt="li"
                                        width={20}
                                        height={20}
                                        className="h-5 w-5 object-contain"
                                    />
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
                                    <Image
                                        src="/social-icons/whatsup-icon.png"
                                        alt="li"
                                        width={20}
                                        height={20}
                                        className="h-5 w-5 object-contain"
                                    />
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
                                    <Image
                                        src="/social-icons/twitter-icon.png"
                                        alt="li"
                                        width={20}
                                        height={20}
                                        className="h-5 w-5 object-contain"
                                    />
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
                                    <Image
                                        src="/social-icons/linkedin-icon.png"
                                        alt="li"
                                        width={20}
                                        height={20}
                                        className="h-5 w-5 object-contain"
                                    />
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
