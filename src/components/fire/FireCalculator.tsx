"use client";

import React, {useEffect, useMemo, useRef, useState} from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {AllocationTriple} from "@/components/blocks/AllocationTriple";
import CurrencySelect from "@/components/ui/CurrencySelect";
import SituationBlock from "@/components/blocks/SituationBlock";
import {RetirementBlock} from "@/components/blocks/RetirementBlock";
import {CURRENCY_META} from "@/lib/currency";
import PercentInputLikeInInflation from "@/lib/input-helper";
import JourneyProjection from "@/components/charts/JourneyProjection";

import {
    projectWithInflation,
    monthsToTargetStandard,
    monthsToTargetLifeExpGrowing,
    pvAtRetirementFiniteGrowing,
} from "@/lib/finance";

const baseBlockStyle = "flex flex-1 flex-col gap-6 rounded-2xl px-8 py-12 max-tablet:gap-4 max-tablet:px-4 max-tablet:py-6 border border-gray-100 red p-6 shadow-[0_10px_30px_-1px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.04)]";


type Currency = "EUR" | "USD" | "GBP" | "HUF";
const DEFAULTS = {
    ccy: "EUR" as Currency,

    // SituationBlock
    age: 30,
    cs: 20000,  // currentSavings
    sm: 3000, // savingMonthly

    // RetirementBlock
    as: 40000,      // annualSpend
    mode: "withdrawal" as "withdrawal" | "life",
    wr: 4,

    //AllocationTriple block
    sp: 70,     // stocksPct
    fp: 20,     // fixedPct
    csh: 10,

    srk: "none" as "none" | "custom",   // stocksRateKind
    sr: 0,                              // stocksRate
    frk: "custom" as "none" | "custom" | "preset", // fixedRateKind
    fr: 0,

    //Inflation
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

    type FixedKind = "none" | "custom" | "preset";
    const [fixedRateKind, setFixedRateKind] = useState<FixedKind>(DEFAULTS.frk);
    const [fixedRate, setFixedRate] = useState<number>(DEFAULTS.fr);

    const symbol = CURRENCY_META[currency].symbol;

    const [inflationPct, setInflationPct] = useState(DEFAULTS.infl);

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
        setFixedRateKind(str("frk", DEFAULTS.frk) as "none" | "custom" | "preset");
        setFixedRate(num("fr", DEFAULTS.fr));
        setInflationPct(num("infl", DEFAULTS.infl));
    }, [search]);

    useEffect(() => {
        const fixedPresets = CURRENCY_META[currency].fixedPresets ?? [];
        if (fixedPresets.length === 0) {
            if (fixedRateKind === "preset") {
                setFixedRateKind("custom");
                setFixedRate(0);
            }
        } else {
            if (fixedRateKind === "preset") {
                setFixedRate(fixedPresets[0].rate);
            }
        }
    }, [currency, fixedRateKind]);


    const cashPct = useMemo(() => Math.max(0, Math.min(100, 100 - stocksPct - fixedPct)), [stocksPct, fixedPct]);


    const paramsString = useMemo(() => {
        const p = new URLSearchParams(search.toString());
        const set = (k: string, v: any, def: any) => {
            if (v === def || v === "" || v == null) p.delete(k);
            else p.set(k, String(v));
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
        search,
        currency,
        stocksPct,
        fixedPct,
        age,
        currentSavings,
        savingMonthly,
        annualSpend,
        retMode,
        withdrawalSlider,
        stocksRateKind,
        stocksRate,
        fixedRateKind,
        fixedRate,
        cashPct,
        inflationPct,
    ]);


    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const id = window.setTimeout(() => {
            const url = paramsString ? `${pathname}?${paramsString}` : pathname;
            router.replace(url, { scroll: false });
        }, 500);

        return () => window.clearTimeout(id);
    }, [paramsString, pathname, router]);







    const R_stocks = (stocksRateKind === "custom" ? stocksRate : 0) / 100;
    const R_fixed  = (fixedRateKind  === "custom" ? fixedRate  : 0) / 100;
    const wS = stocksPct / 100;
    const wF = fixedPct / 100;
    const R_nominal = R_stocks * wS + R_fixed * wF;
    const infl = Math.max(0, inflationPct) / 100;

    // параметры режима
    const withdrawalRate = withdrawalSlider / 100; // 2 => 0.02
    const lifeExpectancy = 10 + Math.round((withdrawalSlider / 100) * 110);

    // целевая "цена" FI в сегодняшних деньгах
    let goalReal = 0;
    let monthsToFi = 0;

    if (retMode === "withdrawal") {
        // классическая цель: годовые траты / выбранная ставка из слайдера
        const wr = Math.max(1e-6, withdrawalRate);
        goalReal = annualSpend / wr;

        monthsToFi = monthsToTargetStandard(
            currentSavings,
            savingMonthly,
            R_nominal,
            goalReal // цель в «сегодняшних» — ок
        );
    } else {
        // Life Expectancy: считаем итеративно с учётом роста трат (inflation)
        monthsToFi = monthsToTargetLifeExpGrowing(
            currentSavings,
            savingMonthly,
            R_nominal,
            infl,
            annualSpend, // W_today
            age,
            lifeExpectancy
        );

        // чтобы показать Goal для легенды/линии, восстановим её из найденного горизонта:
        const yearsToFi = Math.max(0, monthsToFi / 12);
        const retirementAge = age + yearsToFi;
        const yearsInRetirement = Math.max(0, lifeExpectancy - retirementAge);
        const spendingAtRet = annualSpend * Math.pow(1 + infl, yearsToFi);
        const targetNominalAtRet = pvAtRetirementFiniteGrowing(
            spendingAtRet,
            R_nominal,
            infl,
            yearsInRetirement
        );
        // вернём в реальные сегодняшние:
        goalReal = targetNominalAtRet / Math.pow(1 + infl, yearsToFi);
    }

    if (!Number.isFinite(monthsToFi) || monthsToFi < 0) monthsToFi = 0;

    const yearsToFiRounded = Math.max(1, Math.ceil(monthsToFi / 12));
    const retireAge = age + yearsToFiRounded;
    const retireSpanYears =
        retMode === "life" ? (lifeExpectancy - retireAge) : undefined;

    const contribYear = savingMonthly * 12;

    // строим ряд ПРОЕКЦИИ до выхода на пенсию
    const rows = projectWithInflation({
        startAge: age,
        years: yearsToFiRounded,
        principal: currentSavings,
        contribYear,
        nominalReturn: R_nominal,
        inflation: infl,
    });

    const kpi = {
        target: goalReal,
        retireAge: Math.round(retireAge),
        annualSavings: contribYear,
        retireSpanYears: retireSpanYears != null ? Math.round(retireSpanYears) : undefined,
    };

    const rowsForChart = rows.map(r => ({
        yearIdx: r.yearIdx,
        age: r.age,
        depositStart: r.depositStart,
        contribYear: r.contribYear,
        interestYear: r.interestYear,
        totalEnd: r.totalEndReal, // график и таблица в «реальных» деньгах
    }));

    const legend = {
        initial: currentSavings,
        contribMonthly: savingMonthly,
        growthPct: R_nominal * 100,
    };



    return (
        <>
            <div className="mx-auto py-6 grid gap-8 max-tablet:mx-4 max-tablet:w-[calc(100%-32px)] max-tablet:grid-cols-1 max-tablet:py-12 w-[1024px] grid-cols-1">
                <div className="relative flex flex-col">
                    <div className="flex flex-col items-center gap-12">

                        <div className="flex flex-col items-center gap-4 pb-4 pt-20">
                            <h1 className="text-7xl font-[Mulish]">FIRE calculator</h1>
                            <div className="mb-2 text-center">
                                <span>FIRE stands for Financial Independence Retire Early. Our calculator will help you work out an investment and savings strategy that could help you join the growing movement of people who aim to retire years earlier than expected.</span>
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
                                    <CurrencySelect value={currency} onValueChangeAction={(v) => setCurrency(v)}/>
                                </div>
                            </div>

                            <div className="flex gap-4 max-tablet:flex-col">
                                <div className="flex w-full flex-col gap-4">
                                    <div className={baseBlockStyle}>
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="text-sm font-bold uppercase text-indigo-800 max-tablet:text-center">
                                                    Today
                                                </div>
                                                <h5 className="text-2xl font-semibold max-tablet:text-center">
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
                                            <div className="flex flex-col items-center gap-2 ">
                                                <div className="text-sm font-bold uppercase text-indigo-800 max-tablet:text-center">
                                                    Later
                                                </div>
                                                <h5 className="text-2xl font-semibold max-tablet:text-center">
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
                                                <div className="text-sm font-bold uppercase text-indigo-800 max-tablet:text-center">
                                                    The plan
                                                </div>
                                                <h5 className="text-2xl font-semibold max-tablet:text-center">
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
                                <h2 className="mb-4 text-lg font-semibold text-slate-900 text-center">Inflation</h2>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    <PercentInputLikeInInflation
                                        value={inflationPct}
                                        onChange={(n) => setInflationPct(n)}
                                        min={0}
                                        max={20000}
                                        step={1}
                                        className="w-36 sm:w-40"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={`${baseBlockStyle} bg-gradient-to-b from-violet-50 `}>
                            <JourneyProjection
                                currencySymbol={symbol}
                                kpi={kpi}
                                rows={rowsForChart}
                                goal={goalReal}
                                legend={legend}
                                mode={retMode}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
