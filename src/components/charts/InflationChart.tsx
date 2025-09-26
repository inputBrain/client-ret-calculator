"use client";

import React, { useMemo, useState } from "react";
import {
    AreaChart, Area, XAxis, YAxis, Tooltip,
    CartesianGrid, ResponsiveContainer
} from "recharts";
import ShareMenu from "@/components/ShareMenu";

type Props = {
    currencySymbol: string;
    initial: number;         // Total savings из SavingsBlock
    years: number;           // How long for? (0..80)
    growthPct: number;       // из GrowthBlock (Annual growth rate, %)
    inflationPct: number;    // из GrowthBlock (Inflation rate, %)
};

const card = "rounded-2xl border border-gray-100 bg-white shadow-[0_10px_30px_-1px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.04)]";
const fmtMoney = (v: number, sym: string) =>
    `${sym}${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const clampYears = (n: number) => Math.max(0, Math.round(n));

const COLOR_BALANCE = "#3b82f6";
const COLOR_BUYING  = "#8b5cf6";

export default function InflationChart({
    currencySymbol, initial, years, growthPct, inflationPct
}: Props) {
    const [tab, setTab] = useState<"chart" | "table">("chart");

    // Простая модель: real = growth - inflation (в процентах)
    const realPct = useMemo(() => (growthPct - inflationPct), [growthPct, inflationPct]);

    // Ряды для графика/таблицы
    const data = useMemo(() => {
        const Y = clampYears(years);
        const g = growthPct / 100;
        const r = realPct / 100;

        const arr: { x: number; balance: number; buying: number }[] = [];
        for (let t = 0; t <= Y; t++) {
            const balance = initial * Math.pow(1 + g, t);   // номинал
            const buying  = initial * Math.pow(1 + r, t);   // инфляц.-скорректированная
            arr.push({ x: t, balance, buying });
        }
        return arr;
    }, [initial, years, growthPct, realPct]);

    const buyingAfterN = data[data.length - 1]?.buying ?? initial;

    // ось X: тики каждые 5 лет + крайние
    const ticksX = useMemo(() => {
        const xs = data.map(d => d.x);
        if (xs.length === 0) return [];
        const first = xs[0], last = xs[xs.length - 1];
        const t: number[] = [];
        for (const x of xs) if (x === first || x === last || x % 5 === 0) t.push(x);
        return Array.from(new Set(t));
    }, [data]);

    const DotSwatch = ({ color }: { color: string }) => (
        <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ background: color }}
        />
    );

    return (
        <>
            {/* KPI trio */}
            <div className="grid grid-cols-3 gap-6 text-center mb-4">
                <div>
                    <div className="text-2xl font-semibold text-slate-900">
                        {growthPct.toFixed(2)}%
                    </div>
                    <div className="text-sm text-slate-600">Annual growth rate</div>
                </div>

                <div>
                    <div className="text-2xl font-semibold text-slate-900">
                        {fmtMoney(buyingAfterN, currencySymbol)}
                    </div>
                    <div className="text-sm text-slate-600">
                        Buying power after {clampYears(years)} {clampYears(years) === 1 ? "year" : "years"}
                    </div>
                </div>

                <div>
                    <div className="text-2xl font-semibold text-slate-900">
                        {realPct.toFixed(2)}%
                    </div>
                    <div className="text-sm text-slate-600">Real rate of return</div>
                </div>
            </div>

            {/* Карточка с табами */}
            <div className={`${card} p-4 sm:p-6`}>
                <div className="gap-2 flex flex-col">
                    <div className="text-sm font-semibold uppercase text-rose-900 text-center">The journey ahead</div>
                    <h5 className="text-2xl font-semibold text-center">Your savings projection</h5>

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
                                    <linearGradient id="fillBalance" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%"  stopColor={COLOR_BALANCE} stopOpacity={0.25} />
                                        <stop offset="100%" stopColor={COLOR_BALANCE} stopOpacity={0.05} />
                                    </linearGradient>
                                    <linearGradient id="fillBuying" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%"  stopColor={COLOR_BUYING} stopOpacity={0.25} />
                                        <stop offset="100%" stopColor={COLOR_BUYING} stopOpacity={0.05} />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid stroke="#eef2ff" vertical={true} />
                                <XAxis
                                    dataKey="x"
                                    ticks={ticksX}
                                    interval={0}
                                    tickFormatter={(v: number) => `${v}`}
                                    tick={{ fontSize: 12, fill: "#64748b" }}
                                    tickLine={false}
                                    axisLine={{ stroke: "#e5e7eb" }}
                                />
                                <YAxis
                                    tickFormatter={(v) => fmtMoney(v, currencySymbol)}
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
                                                    <div className="text-slate-600">End of year</div>
                                                    <div className="font-medium">{p.x}</div>

                                                    <div className="text-slate-600 flex items-center gap-2">
                                                        <DotSwatch color={COLOR_BALANCE} /> Balance
                                                    </div>
                                                    <div className="font-medium">{fmtMoney(p.balance, currencySymbol)}</div>

                                                    <div className="text-slate-600 flex items-center gap-2">
                                                        <DotSwatch color={COLOR_BUYING} /> Buying power
                                                    </div>
                                                    <div className="font-medium">{fmtMoney(p.buying, currencySymbol)}</div>
                                                </div>
                                            </div>
                                        );
                                    }}
                                />

                                {/* линии/площади */}
                                <Area type="monotone" dataKey="balance" stroke={COLOR_BALANCE} strokeWidth={2} fill="url(#fillBalance)" dot={{ r: 2 }} activeDot={{ r: 4 }} />
                                <Area type="monotone" dataKey="buying"  stroke={COLOR_BUYING}  strokeWidth={2} fill="url(#fillBuying)" dot={{ r: 2 }} activeDot={{ r: 4 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-separate border-spacing-0 text-sm">
                            <thead>
                            <tr className="text-left text-slate-600">
                                <th className="py-3 px-4 font-medium">End of Year</th>
                                <th className="py-3 px-4 font-medium">Balance</th>
                                <th className="py-3 px-4 font-medium">Buying power (inflation adjusted)</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.map((r, i) => (
                                <tr key={i} className={i % 2 ? "bg-slate-50/60" : ""}>
                                    <td className="py-3 px-4 text-slate-700">{r.x}</td>
                                    <td className="py-3 px-4">{fmtMoney(r.balance, currencySymbol)}</td>
                                    <td className="py-3 px-4 font-medium text-slate-900">{fmtMoney(r.buying, currencySymbol)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Легенда снизу — цвета соответствуют графику */}
                <div className="mt-8 mb-2 flex items-start justify-between text-sm font-semibold relative">
                    <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs">
                        <div className="flex items-center gap-2">
                            <DotSwatch color={COLOR_BALANCE} />
                            <span>Balance</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <DotSwatch color={COLOR_BUYING} />
                            <span>Buying power (inflation adjusted)</span>
                        </div>
                    </div>


                    <ShareMenu
                        title="My savings projection"
                        text="Check out my savings projection"
                        onCopied={() => {

                        }}
                        trigger={({ onClick, "aria-expanded": expanded }) => (
                            <button
                                onClick={onClick}
                                aria-expanded={expanded}
                                className="rounded-full px-4 py-2 text-sm font-semibold text-indigo-800 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 active:translate-y-[1px] transition"
                            >
                                Share
                            </button>
                        )}
                    />
                </div>
            </div>

        </>
    );
}
