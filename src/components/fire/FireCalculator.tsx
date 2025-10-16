"use client";
import React, {useEffect, useMemo, useState, useCallback} from "react";
import {useRouter, usePathname, useSearchParams} from "next/navigation";
import {AllocationTriple} from "@/components/blocks/AllocationTriple";
import CurrencySelect from "@/components/ui/CurrencySelect";
import SituationBlock from "@/components/blocks/SituationBlock";
import {RetirementBlock} from "@/components/blocks/RetirementBlock";
import {type Currency, CURRENCY_META} from "@/lib/currency";
import JourneyProjection from "@/components/charts/JourneyProjection";
import {
    projectWithInflation,
    monthsToTargetStandard,
    monthsToTargetLifeExp_LY,
    realReturnFromNominal,
} from "@/lib/finance";
import InflationBlockSimple from "@/components/blocks/InflationBlockSimple";

const baseBlockStyle = "flex flex-1 flex-col gap-6 rounded-2xl px-8 py-12 max-tablet:gap-4 max-tablet:px-4 max-tablet:py-6 border border-gray-100 red p-6 shadow-[0_10px_30px_-1px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.04)]";

const DEFAULTS = {
    ccy: "EUR" as Currency,
    age: 30,
    cs: 20000,
    sm: 3000,
    as: 40000,
    mode: "withdrawal" as "withdrawal" | "life",
    wr: 4,
    sp: 70,
    fp: 20,
    csh: 10,
    srk: "custom" as "custom" | "none",
    sr: 7,
    frk: "custom" as "none" | "custom",
    fr: 4,
    infl: 0
};

export default function FireCalculator() {
    const router = useRouter();
    const pathname = usePathname();
    const search = useSearchParams();

    const [currency, setCurrency] = useState<Currency>(DEFAULTS.ccy);
    const [stocksPct, setStocksPct] = useState(DEFAULTS.sp);
    const [fixedPct, setFixedPct] = useState(DEFAULTS.fp);
    const [age, setAge] = useState(DEFAULTS.age);
    const [currentSavings, setCurrentSavings] = useState(DEFAULTS.cs);
    const [savingMonthly, setSavingMonthly] = useState(DEFAULTS.sm);
    const [annualSpend, setAnnualSpend] = useState(DEFAULTS.as);
    const [retMode, setRetMode] = useState<"withdrawal" | "life">(DEFAULTS.mode);
    const [withdrawalSlider, setWithdrawalSlider] = useState(DEFAULTS.wr);
    const [stocksRateKind, setStocksRateKind] = useState<"none" | "custom">(DEFAULTS.srk);
    const [stocksRate, setStocksRate] = useState<number>(DEFAULTS.sr);

    const [fixedRateKind, setFixedRateKind] = useState<"none" | "custom">(DEFAULTS.frk);

    const [fixedRate, setFixedRate] = useState<number>(DEFAULTS.fr);
    const [inflationPct, setInflationPct] = useState(DEFAULTS.infl);
    const [considerCutAfter60, setConsiderCutAfter60] = useState(false);

    const symbol = CURRENCY_META[currency].symbol;

    // Читання з URL тільки один раз при монтуванні
    useEffect(() => {
        const num = (k: string, d: number) => {
            const v = search.get(k);
            if (v == null) return d;
            const n = Number(v);
            return Number.isFinite(n) ? n : d;
        };
        const str = <T extends string>(k: string, d: T) => (search.get(k) as T) ?? d;

        setCurrency(str("ccy", DEFAULTS.ccy));
        setStocksPct(num("sp", DEFAULTS.sp));
        setFixedPct(num("fp", DEFAULTS.fp));
        setAge(num("age", DEFAULTS.age));
        setCurrentSavings(num("cs", DEFAULTS.cs));
        setSavingMonthly(num("sm", DEFAULTS.sm));
        setAnnualSpend(num("as", DEFAULTS.as));
        setRetMode(str("mode", DEFAULTS.mode));
        setWithdrawalSlider(num("wr", DEFAULTS.wr));
        setStocksRateKind(str("srk", DEFAULTS.srk));
        setStocksRate(num("sr", DEFAULTS.sr));
        setFixedRateKind(str("frk", DEFAULTS.frk));
        setFixedRate(num("fr", DEFAULTS.fr));
        setInflationPct(num("infl", DEFAULTS.infl));
    }, []);

    const cashPct = useMemo(
        () => Math.max(0, Math.min(100, 100 - stocksPct - fixedPct)),
        [stocksPct, fixedPct]
    );

    const paramsString = useMemo(() => {
        const p = new URLSearchParams();
        const set = (k: string, v: any, def: any) => {
            if (v === def || v === "" || v == null) return;
            p.set(k, String(v));
        };

        set("ccy", currency, DEFAULTS.ccy);
        set("sp", stocksPct, DEFAULTS.sp);
        set("fp", fixedPct, DEFAULTS.fp);
        set("age", age, DEFAULTS.age);
        set("cs", currentSavings, DEFAULTS.cs);
        set("sm", savingMonthly, DEFAULTS.sm);
        set("as", annualSpend, DEFAULTS.as);
        set("mode", retMode, DEFAULTS.mode);
        set("wr", withdrawalSlider, DEFAULTS.wr);
        set("srk", stocksRateKind, DEFAULTS.srk);
        set("sr", stocksRate, DEFAULTS.sr);
        set("frk", fixedRateKind, DEFAULTS.frk);
        set("fr", fixedRate, DEFAULTS.fr);
        set("csh", cashPct, DEFAULTS.csh);
        set("infl", inflationPct, DEFAULTS.infl);

        return p.toString();
    }, [
        currency, stocksPct, fixedPct, age, currentSavings, savingMonthly,
        annualSpend, retMode, withdrawalSlider, stocksRateKind, stocksRate,
        fixedRateKind, fixedRate, cashPct, inflationPct,
    ]);

    // Debounce URL update
    useEffect(() => {
        const timer = setTimeout(() => {
            const url = paramsString ? `${pathname}?${paramsString}` : pathname;
            router.replace(url, {scroll: false});
        }, 500);

        return () => clearTimeout(timer);
    }, [paramsString, pathname, router]);

    const R_stocks = useMemo(
        () => (stocksRateKind === "custom" ? stocksRate : 0) / 100,
        [stocksRateKind, stocksRate]
    );

    const R_fixed = useMemo(
        () => (fixedRateKind === "custom" ? fixedRate : 0) / 100,
        [fixedRateKind, fixedRate]
    );

    const wS = useMemo(() => stocksPct / 100, [stocksPct]);
    const wF = useMemo(() => fixedPct / 100, [fixedPct]);

    const R_nominal = useMemo(
        () => R_stocks * wS + R_fixed * wF,
        [R_stocks, wS, R_fixed, wF]
    );

    const inflRaw = useMemo(
        () => Math.max(0, inflationPct) / 100,
        [inflationPct]
    );
    const infl = inflRaw <= 0 ? 0 : inflRaw;

    const R_real = useMemo(
        () => realReturnFromNominal(R_nominal, infl),
        [R_nominal, infl]
    );

    const withdrawalRate = useMemo(() => withdrawalSlider / 100, [withdrawalSlider]);
    const lifeExpectancy = useMemo(
        () => 10 + Math.round((withdrawalSlider / 100) * 110),
        [withdrawalSlider]
    );

    const {goalNominalAtRet, monthsToFi, yearsToFiRounded, retireAge, retireSpanYears} = useMemo(() => {
        let goal = 0;
        let months = 0;

        if (retMode === "withdrawal") {
            const wr = Math.max(1e-6, withdrawalRate);
            goal = annualSpend / wr;
            months = monthsToTargetStandard(currentSavings, savingMonthly, R_real, goal);
        } else {
            months = monthsToTargetLifeExp_LY(
                currentSavings, savingMonthly, R_real,
                annualSpend, age, lifeExpectancy
            );
            const yearsToFi = Math.max(0, months / 12);
            const yearsInRet = Math.max(0, lifeExpectancy - (age + yearsToFi));
            goal = annualSpend * yearsInRet;
        }

        if (!Number.isFinite(months) || months < 0) months = 0;
        const years = Math.max(1, Math.ceil(months / 12));
        const retAge = age + years;
        const span = retMode === "life" ? Math.max(0, Math.round(lifeExpectancy - retAge)) : undefined;

        return {
            goalNominalAtRet: goal,
            monthsToFi: months,
            yearsToFiRounded: years,
            retireAge: retAge,
            retireSpanYears: span
        };
    }, [retMode, withdrawalRate, annualSpend, currentSavings, savingMonthly, R_real, age, lifeExpectancy]);

    const contribYear = useMemo(() => savingMonthly * 12, [savingMonthly]);

    const rows = useMemo(() => {
        return projectWithInflation({
            startAge: age,
            years: yearsToFiRounded,
            principal: currentSavings,
            contribYear,
            nominalReturn: R_nominal,
            inflation: infl,
        });
    }, [age, yearsToFiRounded, currentSavings, contribYear, R_nominal, infl]);

    const kpi = useMemo(() => ({
        target: goalNominalAtRet,
        retireAge: Math.round(retireAge),
        annualSavings: contribYear,
        retireSpanYears,
    }), [goalNominalAtRet, retireAge, contribYear, retireSpanYears]);

    const rowsForChart = useMemo(() => {
        return rows.map(r => {
            const discountPowForStart = Math.max(0, r.yearIdx - 1);
            const depositStartReal = r.yearIdx === 0
                ? r.depositStart
                : r.depositStart / Math.pow(1 + infl, discountPowForStart);

            return {
                yearIdx: r.yearIdx,
                age: r.age,
                depositStart: depositStartReal,
                contribYear: r.contribYear,
                interestYear: r.interestYear,
                totalEnd: r.totalEndReal,
            };
        });
    }, [rows, infl]);

    const legend = useMemo(() => ({
        initial: currentSavings,
        contribMonthly: savingMonthly,
        growthPct: R_real * 100,
    }), [currentSavings, savingMonthly, R_real]);

    const [debouncedChartData, setDebouncedChartData] = useState({
        rows: rowsForChart,
        kpi,
        goal: goalNominalAtRet,
        legend,
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedChartData({
                rows: rowsForChart,
                kpi,
                goal: goalNominalAtRet,
                legend,
            });
        }, 300);

        return () => clearTimeout(timer);
    }, [rowsForChart, kpi, goalNominalAtRet, legend]);

    const chartProps = useMemo(() => ({
        currencySymbol: symbol,
        kpi: debouncedChartData.kpi,
        rows: debouncedChartData.rows,
        goal: debouncedChartData.goal,
        legend: debouncedChartData.legend,
        mode: retMode,
        annualSpend,
        inflationPct,
        incomeYieldPct: debouncedChartData.legend.growthPct,
        considerCutAfter60,
        spendingDropAfter60Pct: 20,
        startAgeForSpending: age,
    }), [
        symbol,
        debouncedChartData,
        retMode,
        annualSpend,
        inflationPct,
        considerCutAfter60,
        age,
    ]);

    return (
        <>
            <div className="mx-auto py-6 grid gap-8 max-tablet:mx-4 max-tablet:w-[calc(100%-32px)] max-tablet:grid-cols-1 max-tablet:py-12 w-[1024px] grid-cols-1">
                <div className="relative flex flex-col">
                    <div className="flex flex-col items-center gap-12">
                        <div className="flex flex-col items-center gap-4 pb-4 pt-20">
                            <h1 className="text-7xl font-[Mulish]">FIRE calculator</h1>
                            <div className="mb-2 text-center text-slate-800 leading-relaxed">
                              <span>
                                <strong>FIRE</strong> — short for <em>Financial Independence, Retire Early</em> —
                                is a lifestyle movement focused on achieving financial freedom ahead of the
                                traditional retirement age. This calculator is designed to help you build a
                                personalized savings and investment plan, so you can chart a path toward early
                                retirement and take control of your future.
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
                                    <CurrencySelect
                                        value={currency}
                                        onValueChangeAction={(v) => setCurrency(v)}
                                        exclude={["UAH"]}
                                    />
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
                                                <h5 className="text-2xl font-semibold max-tablet:text-center text-slate-900">
                                                    Your situation
                                                </h5>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <SituationBlock
                                                currencySymbol={symbol}
                                                age={age}
                                                setAge={setAge}
                                                currentSavings={currentSavings}
                                                setCurrentSavings={setCurrentSavings}
                                                savingMonthly={savingMonthly}
                                                setSavingMonthly={setSavingMonthly}
                                            />
                                        </div>
                                    </div>

                                    <div className={baseBlockStyle}>
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="text-sm font-bold uppercase text-rose-600 max-tablet:text-center">
                                                    Later
                                                </div>
                                                <h5 className="text-2xl font-semibold max-tablet:text-center text-slate-900">
                                                    Your retirement
                                                </h5>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <RetirementBlock
                                                currencySymbol={symbol}
                                                annualSpend={annualSpend}
                                                setAnnualSpend={setAnnualSpend}
                                                mode={retMode}
                                                setMode={setRetMode}
                                                sliderVal={withdrawalSlider}
                                                setSliderVal={setWithdrawalSlider}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex w-full flex-col gap-4">
                                    <div className={baseBlockStyle}>
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="text-sm font-bold uppercase text-rose-600 max-tablet:text-center">
                                                    The plan
                                                </div>
                                                <h5 className="text-2xl font-semibold max-tablet:text-center text-slate-900">
                                                    Your investing strategy
                                                </h5>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <AllocationTriple
                                                currency={currency}
                                                stocksPct={stocksPct}
                                                fixedPct={fixedPct}
                                                setStocksPct={setStocksPct}
                                                setFixedPct={setFixedPct}
                                                stocksRateKind={stocksRateKind}
                                                setStocksRateKind={setStocksRateKind}
                                                stocksRate={stocksRate}
                                                setStocksRate={setStocksRate}
                                                fixedRateKind={fixedRateKind}
                                                setFixedRateKind={setFixedRateKind}
                                                fixedRate={fixedRate}
                                                setFixedRate={setFixedRate}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 sm:p-8 rounded-2xl border border-gray-100 bg-white shadow-[0_10px_30px_-1px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.04)]">
                                <h2 className="mb-4 text-lg font-semibold text-rose-600 text-center">Inflation</h2>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    <InflationBlockSimple
                                        inflationPct={inflationPct}
                                        setInflationPct={setInflationPct}
                                    />
                                </div>

                                <div className="mt-12 flex items-center justify-center gap-2 text-sm">
                                    <input
                                        id="lowerAfter60"
                                        type="checkbox"
                                        checked={considerCutAfter60}
                                        onChange={(e) => setConsiderCutAfter60(e.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label htmlFor="lowerAfter60" className="text-slate-700">
                                        Consider cost reduction after 60
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className={`${baseBlockStyle} bg-gradient-to-b from-violet-50`}>
                            <JourneyProjection {...chartProps} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}