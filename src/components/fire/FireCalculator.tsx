"use client";

import React, {useEffect, useMemo, useRef, useState} from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {AllocationTriple} from "@/components/ui/AllocationTriple";
import CurrencySelect from "@/components/ui/CurrencySelect";
import SituationBlock from "@/components/ui/SituationBlock";
import {RetirementBlock} from "@/components/ui/RetirementBlock";
import {CURRENCY_META} from "@/lib/currency";

const baseBlockStyle = "flex flex-1 flex-col gap-6 rounded-2xl px-8 py-12 max-tablet:gap-4 max-tablet:px-4 max-tablet:py-6 border border-gray-100 red p-6 shadow-[0_10px_30px_-1px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.04)]";


type Currency = "EUR" | "USD" | "GBP";
// Значения по умолчанию — будем ими руководствоваться и при запись/очистке
const DEFAULTS = {
    ccy: "EUR" as Currency,
    sp: 70,     // stocksPct
    fp: 20,     // fixedPct
    age: 30,
    cs: 20000,  // currentSavings
    sm: 3000,   // savingMonthly
    as: 0,      // annualSpend
    mode: "withdrawal" as "withdrawal" | "life",
    wr: 10,     // пример: значение слайдера из RetirementBlock (поднимите наверх)
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

    // Поднимите из RetirementBlock, если нужно тоже писать в URL:
    const [retMode, setRetMode] = useState<"withdrawal" | "life">(DEFAULTS.mode);
    const [withdrawalSlider, setWithdrawalSlider] = useState(DEFAULTS.wr);

    const symbol = CURRENCY_META[currency].symbol;

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
    }, [search]);


    // Будем собирать URLSearchParams на основе текущих и чистить дефолты
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
        return p.toString();
    }, [
        search,
        currency, stocksPct, fixedPct,
        age, currentSavings, savingMonthly,
        annualSpend, retMode, withdrawalSlider
    ]);


    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const id = window.setTimeout(() => {
            const url = paramsString ? `${pathname}?${paramsString}` : pathname;
            router.replace(url, { scroll: false });
        }, 300);

        return () => window.clearTimeout(id);
    }, [paramsString, pathname, router]);

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
                                    <CurrencySelect value={currency} onValueChangeAction={setCurrency}/>
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
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
