"use client";

import React from "react";
import CurrencyAmountInput from "./CurrencyAmountInput";
import {Info} from "@/lib/input-helper";



export default function SituationBlock({
    currencySymbol,
    age,
    setAge,
    currentSavings,
    setCurrentSavings,
    savingMonthly,
    setSavingMonthly,
}: {
    currencySymbol: string;
    age: number;
    setAge: (n: number) => void;
    currentSavings: number;
    setCurrentSavings: (n: number) => void;
    savingMonthly: number;
    setSavingMonthly: (n: number) => void;
}) {
    return (
        <>
            {/* Rows */}
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                    <div className="mt-2 grid grid-cols-3 items-center gap-2">
                        <div className="flex items-center text-sm text-nowrap text-slate-800 font-normal">
                            Age
                        </div>

                        <input
                            type="number"
                            inputMode="numeric"
                            min={1}
                            max={120}
                            value={Number.isFinite(age) ? age : ""}
                            onChange={(e) => {
                                const v = parseInt(e.target.value || "0", 10);
                                if (!Number.isFinite(v)) {
                                    setAge(1);
                                    return;
                                }
                                if (v < 1) setAge(1);
                                else if (v > 120) setAge(120);
                                else setAge(v);
                            }}
                            placeholder="Enter age"
                            className="h-11 col-span-2 rounded-xl border border-slate-200 bg-white px-4 text-[15px] text-slate-800 shadow-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
                        />
                    </div>


                    <div className="mt-2 grid grid-cols-3 items-center gap-2">
                        <div className="flex items-center text-sm text-nowrap text-slate-800 font-normal">
                            Current savings
                            <Info tooltip="How much you've already saved. Dont't inclide your pension or illiquid assets like property."/>
                        </div>

                        <CurrencyAmountInput
                            symbol={currencySymbol}
                            value={currentSavings}
                            onChange={setCurrentSavings}
                            placeholder="0"
                            className="col-span-2"
                        />
                    </div>


                    <div className="mt-2 grid grid-cols-3 items-center gap-2">
                        <div className="flex items-center text-sm text-nowrap text-slate-800 font-normal">
                            Saving monthly
                            <Info tooltip="How much of your income you can put aside every month. Don’t include any ongoing pension payments."/>
                        </div>

                        <CurrencyAmountInput
                            symbol={currencySymbol}
                            value={savingMonthly}
                            onChange={setSavingMonthly}
                            placeholder="0"
                            className="col-span-2"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
