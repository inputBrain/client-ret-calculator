"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import CurrencySelect from "@/components/ui/CurrencySelect";
import { CURRENCY_META } from "@/lib/currency";
import JourneyProjection from "@/components/charts/JourneyProjection";
import { projectWithInflation, realReturnFromNominal } from "@/lib/finance";

import SavingsBlock from "@/components/blocks/inflation-page/SavingsBlock";
import GrowthBlock from "@/components/blocks/inflation-page/GrowthBlock";

const baseBlockStyle =
    "flex flex-1 flex-col gap-6 rounded-2xl px-8 py-12 max-tablet:gap-4 max-tablet:px-4 max-tablet:py-6 border border-gray-100 red p-6 shadow-[0_10px_30px_-1px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.04)]";

type Currency = "EUR" | "USD" | "GBP" | "HUF";
const DEFAULTS = {
    ccy: "EUR" as Currency,
    ts: 20000, // totalSavings
    yrs: 10,   // years horizon
    infl: 0,   // inflation %
    gr: 0,     // growth %
};

export default function Inflation() {
    const router = useRouter();
    const pathname = usePathname();
    const search = useSearchParams();

    const [currency, setCurrency] = useState<Currency>(DEFAULTS.ccy);
    const [totalSavings, setTotalSavings] = useState<number>(DEFAULTS.ts);
    const [years, setYears] = useState<number>(DEFAULTS.yrs);

    const [inflationPct, setInflationPct] = useState<number>(DEFAULTS.infl);
    const [growthPct, setGrowthPct] = useState<number>(DEFAULTS.gr);

    const symbol = CURRENCY_META[currency].symbol;

    // URL -> state
    useEffect(() => {
        const num = (k: string, d: number) => {
            const v = search.get(k);
            if (v == null) return d;
            const n = Number(v);
            return Number.isFinite(n) ? n : d;
        };
        const str = <T extends string>(k: string, d: T) => (search.get(k) as T) ?? d;

        setCurrency(str("ccy", DEFAULTS.ccy));
        setTotalSavings(num("ts", DEFAULTS.ts));
        setYears(num("yrs", DEFAULTS.yrs));
        setInflationPct(num("infl", DEFAULTS.infl));
        setGrowthPct(num("gr", DEFAULTS.gr));
    }, [search]);

    // state -> URL (только отличия от дефолтов)
    const paramsString = useMemo(() => {
        const p = new URLSearchParams(search.toString());
        const set = (k: string, v: any, def: any) => {
            if (v === def || v === "" || v == null) p.delete(k);
            else p.set(k, String(v));
        };
        set("ccy", currency, DEFAULTS.ccy);
        set("ts", totalSavings, DEFAULTS.ts);
        set("yrs", years, DEFAULTS.yrs);
        set("infl", inflationPct, DEFAULTS.infl);
        set("gr", growthPct, DEFAULTS.gr);
        return p.toString();
    }, [search, currency, totalSavings, years, inflationPct, growthPct]);

    useEffect(() => {
        const url = paramsString ? `${pathname}?${paramsString}` : pathname;
        router.replace(url, { scroll: false });
    }, [paramsString, pathname, router]);

    // --- расчёты для графика (минимально) ---
    const R_nominal = Math.max(0, growthPct) / 100;
    const infl = Math.max(0, inflationPct) / 100;
    const R_real = realReturnFromNominal(R_nominal, infl);

    const contribYear = 0; // пока без пополнений, как договорились

    const rows = projectWithInflation({
        startAge: 0,                // не используется в KPI сейчас
        years: Math.max(0, Math.round(years)),
        principal: totalSavings,
        contribYear,
        nominalReturn: R_nominal,
        inflation: infl,
    });

    const rowsForChart = rows.map((r) => ({
        yearIdx: r.yearIdx,
        age: r.age,
        depositStart: r.depositStart, // номинал тут не важен, график позже подправим
        contribYear: r.contribYear,
        interestYear: r.interestYear,
        totalEnd: r.totalEndReal,
    }));

    const kpi = {
        target: 0,             // временно
        retireAge: 0,          // временно
        annualSavings: contribYear,
        retireSpanYears: undefined as number | undefined,
    };

    const legend = {
        initial: totalSavings,
        contribMonthly: 0,
        growthPct: R_real * 100,
    };

    return (
        <>
            <div className="mx-auto py-6 grid gap-8 max-tablet:mx-4 max-tablet:w-[calc(100%-32px)] max-tablet:grid-cols-1 max-tablet:py-12 w-[1024px] grid-cols-1">
                <div className="relative flex flex-col">
                    <div className="flex flex-col items-center gap-12">
                        <div className="flex flex-col items-center gap-4 pb-4 pt-20">
                            <h1 className="text-7xl font-[Mulish]">
                                Inflation Calculator for <br /> Investments & Savings
                            </h1>
                            <div className="mb-2 text-center">
                <span>
                  Use this tool to forecast how much your investments could be worth in the future, based on the growth rate and inflation rate you expect. Past performance is not a reliable indicator of future returns.
                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto grid gap-8 py-16 max-tablet:mx-4 max-tablet:w-[calc(100%-32px)] max-tablet:grid-cols-1 max-tablet:py-12 w-[1024px] grid-cols-1">
                <div className="relative flex flex-col">
                    <div className="flex flex-col gap-10">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col items-end">
                                <div className="flex justify-end">
                                    <CurrencySelect value={currency} onValueChangeAction={(v) => setCurrency(v)} />
                                </div>
                            </div>

                            <div className="flex gap-4 max-tablet:flex-col">
                                <div className="flex w-full flex-col gap-4">
                                    <div className={baseBlockStyle}>
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="text-sm font-bold uppercase text-rose-600 max-tablet:text-center">
                                                    Today
                                                </div>
                                                <h5 className="text-2xl font-semibold  max-tablet:text-center text-slate-900">
                                                    Your Savings
                                                </h5>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <SavingsBlock
                                                currencySymbol={symbol}
                                                totalSavings={totalSavings}
                                                setTotalSavings={setTotalSavings}
                                                years={years}
                                                setYears={setYears}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex w-full flex-col gap-4">
                                    <div className={baseBlockStyle}>
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="text-sm font-bold uppercase text-rose-600 max-tablet:text-center">
                                                    Your Projection
                                                </div>
                                                <h5 className="text-2xl font-semibold max-tablet:text-center text-slate-900">
                                                    Inflation vs Growth
                                                </h5>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <GrowthBlock
                                                inflationPct={inflationPct}
                                                setInflationPct={setInflationPct}
                                                growthPct={growthPct}
                                                setGrowthPct={setGrowthPct}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`${baseBlockStyle} bg-gradient-to-b from-violet-50 `}>
                            <JourneyProjection
                                currencySymbol={symbol}
                                kpi={kpi}
                                rows={rowsForChart}
                                goal={0}
                                legend={legend}
                                mode="life" // временно — график не зависит сейчас
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
