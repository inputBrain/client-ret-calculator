"use client";

import React, {useEffect, useMemo, useRef, useState} from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {AllocationTriple} from "@/components/blocks/AllocationTriple";
import CurrencySelect from "@/components/ui/CurrencySelect";
import SituationBlock from "@/components/blocks/SituationBlock";
import {RetirementBlock} from "@/components/blocks/RetirementBlock";
import {type Currency, CURRENCY_META} from "@/lib/currency";
import JourneyProjection from "@/components/charts/JourneyProjection";

import {
    projectWithInflation,
    monthsToTargetStandard,
    monthsToTargetLifeExp_LY, realReturnFromNominal,
} from "@/lib/finance";
import InflationBlockSimple from "@/components/blocks/InflationBlockSimple";

const baseBlockStyle = "flex flex-1 flex-col gap-6 rounded-2xl px-8 py-12 max-tablet:gap-4 max-tablet:px-4 max-tablet:py-6 border border-gray-100 red p-6 shadow-[0_10px_30px_-1px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.04)]";


// type Currency = "EUR" | "USD" | "GBP";
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
    // const infl = Math.max(0, inflationPct) / 100;

    const inflRaw = Math.max(0, inflationPct) / 100;
    const infl = inflRaw <= 0 ? 0 : inflRaw;

    const R_real = realReturnFromNominal(R_nominal, infl); // доходность в "деньгах сегодня"

    // параметры режима
    const withdrawalRate = withdrawalSlider / 100; // 2 => 0.02
    const lifeExpectancy = 10 + Math.round((withdrawalSlider / 100) * 110);

    // целевая "цена" FI в сегодняшних деньгах
    let goalNominalAtRet = 0;
    let monthsToFi = 0;

    if (retMode === "withdrawal") {
        const wr = Math.max(1e-6, withdrawalRate);
        // Цель в "деньгах сегодня"
        goalNominalAtRet = annualSpend / wr;
        // Срок до цели — считаем в "реальных" деньгах
        monthsToFi = monthsToTargetStandard(currentSavings, savingMonthly, R_real, goalNominalAtRet);
    } else {
        // Режим Life — используем "реальную" доходность тоже,
        // чтобы инфляция влияла на срок до цели.
        monthsToFi = monthsToTargetLifeExp_LY(
            currentSavings,
            savingMonthly,
            R_real,          // ← было R_nominal
            annualSpend,
            age,
            lifeExpectancy
        );
        const yearsToFi = Math.max(0, monthsToFi / 12);
        const yearsInRet = Math.max(0, lifeExpectancy - (age + yearsToFi));
        // Цель (KPI.target) у тебя уже в "деньгах сегодня"
        goalNominalAtRet = annualSpend * yearsInRet;
    }

    if (!Number.isFinite(monthsToFi) || monthsToFi < 0) monthsToFi = 0;

    const yearsToFiRounded = Math.max(1, Math.ceil(monthsToFi / 12));
    const retireAge = age + yearsToFiRounded;
    const retireSpanYears = retMode === "life" ? Math.max(0, Math.round(lifeExpectancy - retireAge)) : undefined;

    const contribYear = savingMonthly * 12;

    // строим ряд ПРОЕКЦИИ до выхода на пенсию
    const rows = projectWithInflation({
        startAge: age,
        years: yearsToFiRounded,
        principal: currentSavings,
        contribYear,
        nominalReturn: R_nominal,
        inflation: infl, // не влияет на номинальные totalEnd, но пригодится если захочешь реальную таблицу
    });

    const kpi = {
        target: goalNominalAtRet,   // <-- справа в KPI показывается 200 000
        retireAge: Math.round(retireAge),
        annualSavings: contribYear,
        retireSpanYears,
    };


    const rowsForChart = rows.map(r => {
        // для "Initial deposit" в таблице тоже приведём к "деньгам сегодня"
        const discountPowForStart = Math.max(0, r.yearIdx - 1);
        const depositStartReal =
            r.yearIdx === 0 ? r.depositStart : r.depositStart / Math.pow(1 + infl, discountPowForStart);

        return {
            yearIdx: r.yearIdx,
            age: r.age,
            depositStart: depositStartReal, // real
            contribYear: r.contribYear,     // можно оставить номинал, он в таблице сейчас не выводится
            interestYear: r.interestYear,   // "за год", номинал — в тултипе не используется
            totalEnd: r.totalEndReal,       // ← real: именно это рисуем и показываем
        };
    });

    const legend = {
        initial: currentSavings,
        contribMonthly: savingMonthly,
        growthPct: R_real * 100, // реальная p/a
    };



    const [considerCutAfter60, setConsiderCutAfter60] = useState(false);

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
                                                <h5 className="text-2xl font-semibold  max-tablet:text-center text-slate-900">
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

                                {/* Чекбокс: враховувати зниження витрат після 60 */}
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

                        <div className={`${baseBlockStyle} bg-gradient-to-b from-violet-50 `}>
                            <JourneyProjection
                                currencySymbol={symbol}
                                kpi={kpi}
                                rows={rowsForChart}
                                goal={goalNominalAtRet}
                                legend={legend}
                                mode={retMode}

                                annualSpend={annualSpend}
                                inflationPct={inflationPct}
                                incomeYieldPct={legend.growthPct}
                                considerCutAfter60={considerCutAfter60}
                                spendingDropAfter60Pct={20}
                                startAgeForSpending={age}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
