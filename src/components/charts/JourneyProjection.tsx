"use client";
import React, {useMemo, useState, useCallback} from "react";
import {
    AreaChart, Area, Line, XAxis, YAxis, Tooltip, CartesianGrid,
    ResponsiveContainer, ReferenceLine, Label,
} from "recharts";
import ShareMenu from "@/components/ShareMenu";

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
        retireSpanYears?: number | null;
    };
    rows: Row[];
    goal: number;
    legend: {
        initial: number;
        contribMonthly: number;
        growthPct: number;
    };
    mode?: "withdrawal" | "life";
    annualSpend?: number;
    inflationPct?: number;
    incomeYieldPct?: number;
    considerCutAfter60?: boolean;
    spendingDropAfter60Pct?: number;
    startAgeForSpending?: number;
};

const card = "rounded-2xl border border-gray-100 bg-white shadow-[0_10px_30px_-1px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.04)]";

const fmt = (v: number, sym: string) =>
    `${sym}${v.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

const COLOR_TOTAL = "#3b82f6";
const COLOR_INITIAL = "#94a3b8";
const COLOR_CONTRIB = "#a855f7";
const COLOR_GROWTH = "#22c55e";
const COLOR_INV_INCOME = "#0ea5e9";
const COLOR_EXPENSES = "#f97316";


const DotSwatch = React.memo(({color}: {color: string}) => (
    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{background: color}} />
));
DotSwatch.displayName = "DotSwatch";


function downsampleToMax<T>(arr: T[], max: number): T[] {
    if (arr.length <= max) return arr;
    const step = (arr.length - 1) / (max - 1);
    return Array.from({length: max}, (_, i) => arr[Math.round(i * step)]);
}


const JourneyProjection = React.memo(function JourneyProjection({
    currencySymbol,
    kpi,
    rows,
    goal,
    legend,
    mode,
    annualSpend,
    inflationPct,
    incomeYieldPct,
    considerCutAfter60 = false,
    spendingDropAfter60Pct = 20,
    startAgeForSpending,
}: JourneyProjectionProps) {
    const [tab, setTab] = useState<"chart" | "table">("chart");

    const fullData = useMemo(() => {
        const infl = Math.max(0, (inflationPct ?? 0)) / 100;
        let contribRealCum = 0;
        let interestRealCum = 0;

        return rows.map((r) => {
            const x = r.yearIdx;
            const totalReal = Number(r.totalEnd.toFixed(2));

            const contribYearReal = infl
                ? r.contribYear / Math.pow(1 + infl, x)
                : r.contribYear;
            contribRealCum += contribYearReal;

            const interestYearReal = infl
                ? r.interestYear / Math.pow(1 + infl, x)
                : r.interestYear;
            interestRealCum += interestYearReal;

            const growthRealCum = Math.max(0, totalReal - legend.initial - contribRealCum);

            return {
                x,
                age: r.age,
                y: totalReal,
                initial: legend.initial,
                contribYearReal,
                contribCum: contribRealCum,
                interestYearReal,
                interestRealCum,
                growthCum: growthRealCum,
            };
        });
    }, [rows, legend, inflationPct]);

    const data = useMemo(() => downsampleToMax(fullData, 120), [fullData]);

    const ticksEvery5 = useMemo(() => {
        const xs = data.map((d) => d.x);
        const first = xs[0], last = xs[xs.length - 1];
        const t: number[] = [];
        for (const x of xs) {
            if (x === first || x === last || x % 5 === 0) t.push(x);
        }
        return Array.from(new Set(t));
    }, [data]);

    const GoalPill = useCallback(({value}: {value: string}) => {
        return (
            <Label
                position="insideLeft"
                content={(props) => {
                    const {viewBox} = props as any;
                    const y = viewBox.y;
                    const x = viewBox.x + 8;
                    const text = `Goal: ${value}`;
                    const w = 10 + text.length * 7;
                    const h = 22;
                    return (
                        <g transform={`translate(${x},${y - h - 6})`}>
                            <rect width={w} height={h} rx={11} ry={11} fill="#065f46" />
                            <text x={10} y={14} fontSize={12} fill="#ecfdf5">
                                {text}
                            </text>
                        </g>
                    );
                }}
            />
        );
    }, []);

    const retireAgeMeta = useMemo(() => {
        const over = kpi.retireAge > 120;
        if (over && mode !== "life") {
            return {number: "Over 120", subtitle: "Retirement age... R.I.P."};
        }
        if (over && mode === "life") {
            return {number: 120, subtitle: "Retirement age (0 year retirement)"};
        }
        const baseSub =
            mode === "life" && kpi.retireSpanYears != null
                ? `(${kpi.retireSpanYears} year retirement)`
                : "";
        return {number: kpi.retireAge, subtitle: baseSub};
    }, [kpi.retireAge, kpi.retireSpanYears, mode]);

    const enriched = useMemo(() => {
        const baseAge =
            typeof startAgeForSpending === "number"
                ? startAgeForSpending
                : (data[0]?.age ?? 0);

        const wrEff = goal > 0 && (annualSpend ?? 0) > 0 ? (annualSpend as number) / goal : 0;

        return data.map((d, idx) => {
            const age = (data[idx]?.age ?? baseAge) as number;

            let exp = annualSpend ?? 0;
            if (considerCutAfter60 && age >= 60) {
                exp *= 1 - (spendingDropAfter60Pct ?? 20) / 100;
            }

            const baseReal = (d.initial ?? 0) + (d.contribCum ?? 0);
            const invIncome = (d.y ?? 0) * wrEff;

            return {...d, exp, invIncome, age};
        });
    }, [
        data,
        annualSpend,
        goal,
        considerCutAfter60,
        spendingDropAfter60Pct,
        startAgeForSpending,
    ]);

    const crossIdx = useMemo(() => {
        for (let i = 0; i < enriched.length; i++) {
            const p = enriched[i];
            if ((p.invIncome ?? 0) >= (p.exp ?? 0)) return i;
        }
        return -1;
    }, [enriched]);

    const crossPoint = useMemo(
        () => (crossIdx >= 0 ? enriched[crossIdx] : null),
        [crossIdx, enriched]
    );

    const idx60 = useMemo(
        () => enriched.findIndex((p) => (p.age ?? 0) >= 60),
        [enriched]
    );

    const xAt60 = useMemo(
        () => (idx60 >= 0 ? enriched[idx60].x : null),
        [idx60, enriched]
    );

    const TooltipContent = useCallback(
        ({active, payload}: any) => {
            if (!active || !payload?.length) return null;
            const p: any = payload[0].payload;
            return (
                <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-[0_10px_30px_-1px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.04)]">
                    <div className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 text-sm">
                        <div className="text-slate-600 flex items-center gap-2">
                            <DotSwatch color={COLOR_INV_INCOME} />
                            Investment income
                        </div>
                        <div className="font-medium">{fmt(p.invIncome ?? 0, currencySymbol)}</div>

                        <div className="text-slate-600 flex items-center gap-2">
                            <DotSwatch color={COLOR_EXPENSES} />
                            Expenses (infl.-adj.)
                        </div>
                        <div className="font-medium">{fmt(p.exp ?? 0, currencySymbol)}</div>

                        <div className="text-slate-600 flex items-center gap-2">
                            <DotSwatch color={COLOR_CONTRIB} />
                            Contributions (total)
                        </div>
                        <div className="font-medium">{fmt(p.contribCum, currencySymbol)}</div>

                        <div className="text-slate-600 flex items-center gap-2">
                            <DotSwatch color={COLOR_GROWTH} />
                            Growth (total)
                        </div>
                        <div className="font-medium">{fmt(p.growthCum, currencySymbol)}</div>

                        <div className="text-slate-600 flex items-center gap-2">
                            <DotSwatch color={COLOR_INITIAL} />
                            Initial lump sum
                        </div>
                        <div className="font-medium">{fmt(p.initial, currencySymbol)}</div>
                    </div>

                    <div className="my-3 h-px bg-gray-100" />

                    <div className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 text-sm">
                        <div className="text-slate-600">Age</div>
                        <div className="font-semibold">{p.age}</div>

                        <div className="text-slate-600 flex items-center gap-2">
                            <DotSwatch color={COLOR_TOTAL} />
                            Total saved
                        </div>
                        <div className="font-semibold">{fmt(p.y, currencySymbol)}</div>
                    </div>
                </div>
            );
        },
        [currencySymbol]
    );

    return (
        <>
            {/* KPI trio */}
            <div className="grid grid-cols-3 gap-6 text-center mb-4">
                <div>
                    <div className="text-2xl font-semibold text-slate-900">
                        {fmt(kpi.target, currencySymbol)}
                    </div>
                    <div className="text-sm text-slate-600">Your FIRE target</div>
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
            <div className={`${card} p-4 sm:p-6`}>
                <div className="gap-2 flex flex-col">
                    <div className="text-sm font-semibold uppercase text-rose-900 text-center">
                        The journey ahead
                    </div>
                    <h5 className="text-2xl font-semibold text-center">Your FIRE projection</h5>
                    <div className="flex items-center justify-center gap-3 text-xs mb-4">
                        <button
                            onClick={() => setTab("chart")}
                            className={`rounded-full px-3 py-1 font-medium ${
                                tab === "chart"
                                    ? "bg-indigo-50 text-indigo-800"
                                    : "text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                            Chart
                        </button>
                        <button
                            onClick={() => setTab("table")}
                            className={`rounded-full px-3 py-1 font-medium ${
                                tab === "table"
                                    ? "bg-indigo-50 text-indigo-800"
                                    : "text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                            Table
                        </button>
                    </div>
                </div>

                {tab === "chart" ? (
                    <div className="h-[360px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={enriched}
                                margin={{top: 10, right: 12, left: 0, bottom: 0}}
                            >
                                <defs>
                                    <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={COLOR_TOTAL} stopOpacity={0.3} />
                                        <stop offset="100%" stopColor={COLOR_TOTAL} stopOpacity={0.04} />
                                    </linearGradient>
                                    <linearGradient id="fillContrib" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={COLOR_CONTRIB} stopOpacity={0.3} />
                                        <stop offset="100%" stopColor={COLOR_CONTRIB} stopOpacity={0.03} />
                                    </linearGradient>
                                    <linearGradient id="fillGrowth" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={COLOR_GROWTH} stopOpacity={0.3} />
                                        <stop offset="100%" stopColor={COLOR_GROWTH} stopOpacity={0.03} />
                                    </linearGradient>
                                    <linearGradient id="fillInvIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={COLOR_INV_INCOME} stopOpacity={0.3} />
                                        <stop offset="100%" stopColor={COLOR_INV_INCOME} stopOpacity={0.03} />
                                    </linearGradient>
                                    <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={COLOR_EXPENSES} stopOpacity={0.3} />
                                        <stop offset="100%" stopColor={COLOR_EXPENSES} stopOpacity={0.03} />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid stroke="#eef2ff" vertical={true} />

                                <XAxis
                                    dataKey="x"
                                    ticks={ticksEvery5}
                                    interval={0}
                                    tickFormatter={(v: number) => (v === 0 ? "Y0" : `Y${v}`)}
                                    tick={{fontSize: 12, fill: "#64748b"}}
                                    tickLine={false}
                                    axisLine={{stroke: "#e5e7eb"}}
                                />

                                <YAxis
                                    orientation="right"
                                    tickFormatter={(v) => fmt(v, currencySymbol)}
                                    width={90}
                                    tick={{fontSize: 12, fill: "#64748b"}}
                                    tickLine={false}
                                    axisLine={{stroke: "#e5e7eb"}}
                                    tickMargin={2}
                                />

                                <Tooltip
                                    cursor={{stroke: "#c7d2fe", strokeDasharray: 4}}
                                    content={TooltipContent}
                                />

                                <ReferenceLine
                                    y={goal}
                                    stroke={COLOR_GROWTH}
                                    strokeDasharray="6 6"
                                    label={<GoalPill value={fmt(goal, currencySymbol)} />}
                                />

                                {crossPoint && (
                                    <ReferenceLine
                                        x={crossPoint.x}
                                        stroke="#94a3b8"
                                        strokeDasharray="6 6"
                                        label={
                                            <Label
                                                position="top"
                                                value={`Crossover @ Y${crossPoint.x}`}
                                                offset={10}
                                                fill="#475569"
                                                fontSize={12}
                                            />
                                        }
                                    />
                                )}

                                <Area
                                    type="monotone"
                                    dataKey="y"
                                    stroke={COLOR_TOTAL}
                                    strokeWidth={2}
                                    fill="url(#fillTotal)"
                                    dot={{r: 2}}
                                    activeDot={{r: 4}}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="initial"
                                    stroke={COLOR_INITIAL}
                                    strokeDasharray="4 4"
                                    dot={false}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="contribCum"
                                    stroke={COLOR_CONTRIB}
                                    strokeWidth={1.5}
                                    fill="url(#fillContrib)"
                                    dot={{r: 1.5}}
                                    activeDot={{r: 3}}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="growthCum"
                                    stroke={COLOR_GROWTH}
                                    strokeWidth={1.5}
                                    fill="url(#fillGrowth)"
                                    dot={{r: 1.5}}
                                    activeDot={{r: 3}}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="invIncome"
                                    stroke={COLOR_INV_INCOME}
                                    strokeWidth={2}
                                    fill="url(#fillInvIncome)"
                                    dot={{r: 2}}
                                    activeDot={{r: 4}}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="exp"
                                    stroke={COLOR_EXPENSES}
                                    strokeWidth={2}
                                    fill="url(#fillExpenses)"
                                    dot={{r: 2}}
                                    activeDot={{r: 4}}
                                    style={{mixBlendMode: "multiply"}}
                                />

                                {considerCutAfter60 && xAt60 != null && (
                                    <ReferenceLine
                                        x={xAt60}
                                        stroke="#0ea5e9"
                                        strokeDasharray="4 3"
                                        label={
                                            <Label
                                                position="insideLeft"
                                                value="Age 60 (spending adjusted)"
                                                offset={10}
                                                fill="#0369a1"
                                                fontSize={12}
                                            />
                                        }
                                    />
                                )}
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
                                <th className="py-3 px-4 font-medium">Contributions (total)</th>
                                <th className="py-3 px-4 font-medium">Interest (this year)</th>
                                <th className="py-3 px-4 font-medium">Interest (total)</th>
                                <th className="py-3 px-4 font-medium">Growth (total)</th>
                                <th className="py-3 px-4 font-medium">Total saved</th>
                            </tr>
                            </thead>
                            <tbody>
                            {fullData.map((d, i) => (
                                <tr key={i} className={i % 2 ? "bg-slate-100/80" : ""}>
                                    <td className="py-3 px-4 text-slate-700">
                                        Year {d.x}
                                        <br />
                                        (age {d.age})
                                    </td>
                                    <td className="py-3 px-4">{fmt(d.initial, currencySymbol)}</td>
                                    <td className="py-3 px-4">{fmt(d.contribCum, currencySymbol)}</td>
                                    <td className="py-3 px-4">{fmt(d.interestYearReal, currencySymbol)}</td>
                                    <td className="py-3 px-4">{fmt(d.interestRealCum, currencySymbol)}</td>
                                    <td className="py-3 px-4">{fmt(d.growthCum, currencySymbol)}</td>
                                    <td className="py-3 px-4 font-medium text-slate-900">
                                        {fmt(d.y, currencySymbol)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Legend + Share */}
                <div className="mt-8 mb-10 flex items-start justify-between text-sm font-semibold relative">
                    <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs">
                        <div className="flex items-center gap-2">
                            <DotSwatch color={COLOR_INV_INCOME} />
                            <span>Investment income</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <DotSwatch color={COLOR_EXPENSES} />
                            <span>Expenses (infl.-adj.)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <DotSwatch color={COLOR_TOTAL} />
                            <span>Total</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <DotSwatch color={COLOR_CONTRIB} />
                            <span>Contributions</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <DotSwatch color={COLOR_GROWTH} />
                            <span>Growth</span>
                        </div>
                    </div>

                    <ShareMenu
                        title="My FIRE projection"
                        text="Check out my FIRE projection"
                        onCopied={() => {}}
                        trigger={({onClick, "aria-expanded": expanded}) => (
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
});

export default JourneyProjection;