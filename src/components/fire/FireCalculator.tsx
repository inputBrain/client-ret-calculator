"use client";

import React, {useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import {AllocationTriple} from "@/components/ui/AllocationTriple";
import CurrencySelect from "@/components/ui/CurrencySelect";
import SituationBlock from "@/components/ui/SituationBlock";
import {CURRENCY_META} from "@/lib/currency";
import RetirementBlock from "@/components/ui/RetirementBlock";

const baseBlockStyle = "flex flex-1 flex-col gap-6 rounded-2xl px-8 py-12 max-tablet:gap-4 max-tablet:px-4 max-tablet:py-6 border border-gray-100 red p-6 shadow-[0_10px_30px_-1px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.04)]";


type Currency = "EUR" | "USD" | "GBP";

export default function FireCalculator() {
    const search = useSearchParams();

    const [currency, setCurrency] = useState<Currency>("EUR");

    const [stocksPct, setStocksPct] = useState<number>(70);
    const [fixedPct, setFixedPct] = useState<number>(20);
    const symbol = CURRENCY_META[currency].symbol;
    const [age, setAge] = useState<number>(30);
    const [currentSavings, setCurrentSavings] = useState<number>(20000);
    const [savingMonthly, setSavingMonthly] = useState<number>(3000);

    const [annualSpend, setAnnualSpend] = useState<number>(0);


    useEffect(() => {
        const get = (k: string, d: number) => {
            const v = search.get(k);
            if (v == null) return d;
            const n = Number(v);
            return Number.isFinite(n) ? n : d;
        };
        const getStr = (k: string, d: string) => {
            const v = search.get(k);
            return v ?? d;
        };
        setCurrency((getStr("ccy", "EUR") as Currency) || "EUR");
        setStocksPct(get("sp", 70));
        setFixedPct(get("fp", 20));
    }, [search]);

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
