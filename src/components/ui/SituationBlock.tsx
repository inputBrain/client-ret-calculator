"use client";

import React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import CurrencyAmountInput from "./CurrencyAmountInput";

function Info({tooltip}: { tooltip: string }) {
    return (
        <Tooltip.Provider delayDuration={200}>
            <Tooltip.Root>
                <Tooltip.Trigger
                    className="ml-2 inline-flex size-4 items-center justify-center rounded-full bg-indigo-600 text-white text-lg "
                    aria-label="Info"
                >
                    i
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content
                        className="max-w-xs rounded-xl bg-slate-800 px-3 py-2 text-sm text-white shadow-xl"
                        side="top"
                        sideOffset={8}
                    >
                        {tooltip}
                        <Tooltip.Arrow className="fill-slate-900"/>
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
}

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
                            value={Number.isFinite(age) ? age : 0}
                            onChange={(e) => setAge(parseInt(e.target.value || "0", 10))}
                            placeholder="Enter age"
                            className="h-11 col-span-2  rounded-xl border border-slate-200 bg-white px-4 text-[15px] text-slate-800 shadow-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 "
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


                        <input
                            type="number"
                            inputMode="numeric"
                            value={Number.isFinite(age) ? age : 0}
                            onChange={(e) => setAge(parseInt(e.target.value || "0", 10))}
                            placeholder="Enter age"
                            className="h-11 col-span-2  rounded-xl border border-slate-200 bg-white px-4 text-[15px] text-slate-800 shadow-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 "
                        />
                    </div>




                    <div
                        className="-mx-3 flex min-h-12 items-center justify-between gap-1 rounded bg-background-interactive-tertiary px-3 py-2 [&_>_*:first-child]:flex-[1_1_30%] [&_>_*:nth-child(2)]:flex-[1_1_70%]">
          <span className="text-sm text-shadow-2xs">
            <div className="flex flex-1 items-center gap-1">
              <span>Current savings</span>
              <Info tooltip="How much you've already saved. Dont't inclide your pension or illiquid assets like property."/>
            </div>
          </span>
                        <div className="flex w-full flex-col gap-2">
                            <div className="flex flex-col gap-2">
                                <CurrencyAmountInput
                                    symbol={currencySymbol}
                                    value={currentSavings}
                                    onChange={setCurrentSavings}
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>




                </div>






                {/* Saving monthly */}
                <div
                    className="-mx-3 flex min-h-12 items-center justify-between gap-1 rounded bg-background-interactive-tertiary px-3 py-2 [&_>_*:first-child]:flex-[1_1_30%] [&_>_*:nth-child(2)]:flex-[1_1_70%]">
          <span className="text-sm text-shadow-2xs">
            <div className="flex flex-1 items-center gap-1">
              <span>Saving monthly</span>
              <Info tooltip="How much you plan to add every month."/>
            </div>
          </span>
                    <div className="flex w-full flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <CurrencyAmountInput
                                symbol={currencySymbol}
                                value={savingMonthly}
                                onChange={setSavingMonthly}
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>
            </div>
</>

    );

}
