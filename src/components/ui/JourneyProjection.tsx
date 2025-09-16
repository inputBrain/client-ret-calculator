"use client";

import React, { useMemo, useState } from "react";
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Dot
} from "recharts";

type Row = {
    yearIdx: number;           // 0..N
    age: number;               // возраст в конце года
    depositStart: number;      // стартовый капитал на начало года
    contribYear: number;       // взносы за год
    interestYear: number;      // доход за год
    totalEnd: number;          // итог на конец года
};

export type JourneyProjectionProps = {
    currencySymbol: string;
    kpi: { target: number; retireAge: number; annualSavings: number };
    rows: Row[];               // уже готовая таблица-расчёт
};

const card = "rounded-2xl border border-gray-100 bg-white shadow-[0_10px_30px_-1px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.04)]";

const fmt = (v: number, sym: string) =>
    `${sym}${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function JourneyProjection({ currencySymbol, kpi, rows }: JourneyProjectionProps) {
    const [tab, setTab] = useState<"chart" | "table">("chart");

    // ось X и Y
    const data = useMemo(
        () =>
            rows.map(r => ({
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
                    <div className="text-2xl font-semibold text-slate-900">{fmt(kpi.target, currencySymbol)}</div>
                    <div className="text-sm text-slate-600">Your FIRE target</div>
                </div>
                <div>
                    <div className="text-5xl leading-none font-semibold text-slate-900">{kpi.retireAge}</div>
                    <div className="text-sm text-slate-600">Retirement age</div>
                </div>
                <div>
                    <div className="text-2xl font-semibold text-slate-900">{fmt(kpi.annualSavings, currencySymbol)}</div>
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
                                {["End of Year", "Initial deposit", "Annual savings", "Interest earned", "Total value"].map((h, i) => (
                                    <th key={i} className="py-3 px-4 font-medium">{h}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {rows.map((r, i) => (
                                <tr key={i} className={i % 2 ? "bg-slate-50/60" : ""}>
                                    <td className="py-3 px-4 text-slate-700">{r.yearIdx} (age {r.age})</td>
                                    <td className="py-3 px-4">{fmt(r.depositStart, currencySymbol)}</td>
                                    <td className="py-3 px-4">{fmt(r.contribYear, currencySymbol)}</td>
                                    <td className="py-3 px-4">{fmt(r.interestYear, currencySymbol)}</td>
                                    <td className="py-3 px-4 font-medium text-slate-900">{fmt(r.totalEnd, currencySymbol)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>


                    </div>
                )}
                <div className="mt-8 mb-10 flex items-start justify-between text-sm font-semibold">
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


                    <button className="rounded-full px-4 py-2 text-sm font-semibold text-indigo-800 bg-indigo-50 border border-indigo-200">
                        Share
                    </button>
                </div>
            </div>
        </>
    );
}
