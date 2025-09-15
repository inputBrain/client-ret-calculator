"use client";

import React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import CurrencyAmountInput from "./CurrencyAmountInput";
import * as Slider from "@radix-ui/react-slider";

export default function RetirementBlock({
    currencySymbol,
    annualSpend,
    setAnnualSpend,
}: {
    currencySymbol: string;
    annualSpend: number;
    setAnnualSpend: (n: number) => void;
}) {
    return (
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                    <div className="mt-2 grid grid-cols-3 items-center gap-2">
                        <div className="flex items-center text-sm text-nowrap text-slate-800 font-normal">
                            Annual spending
                            <Info tooltip="How much you expect to spend every year during retirement"/>
                        </div>

                        <CurrencyAmountInput
                            symbol={currencySymbol}
                            value={annualSpend}
                            onChange={setAnnualSpend}
                            placeholder="0"
                            className="col-span-2"
                        />
                    </div>
                </div>
            </div>





    );
}



function Track() {
    return (
        <Slider.Track className="relative h-1.5 w-full flex-grow rounded-full bg-gray-200">
            <Slider.Range className="absolute h-full rounded-full bg-indigo-500"/>
        </Slider.Track>
    );
}

function Thumb({label}: { label: string }) {
    return (
        <Slider.Thumb
            aria-label={label}
            className="block h-5 w-5 rounded-full bg-indigo-600 shadow outline-none
               focus-visible:ring-4 focus-visible:ring-indigo-300
               data-[state=active]:scale-95"
        />
    );
}

function Row({label, value, onChange}: { label: string; value: number; onChange: (v: number) => void }) {
    return (
        <div
            className="-mx-3 flex min-h-12 items-center justify-between gap-1 rounded bg-background-interactive-tertiary px-3 py-2 [&_>_*:first-child]:flex-[1_1_30%] [&_>_*:nth-child(2)]:flex-[1_1_70%] ">
            <div className="mb-2 flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600 ">{label}</span>
                <span className="text-sm font-semibold tabular-nums text-gray-900">{Math.round(value)}%</span>
            </div>
            <Slider.Root
                className="relative flex h-10 w-full touch-none select-none items-center"
                min={0}
                max={100}
                step={1}
                value={[value]}
                onValueChange={(vals) => onChange(vals[0] ?? value)}
                style={{["--radix-slider-thumb-transform" as any]: "translateX(-50%)"}}
            >
                <Track/>
                <Thumb label={label}/>
            </Slider.Root>
        </div>
    );
}



function Info({tooltip}: { tooltip: string }) {
    return (
        <Tooltip.Provider delayDuration={200}>
            <Tooltip.Root>
                <Tooltip.Trigger className="ml-2 inline-flex size-4 items-center justify-center rounded-full bg-indigo-600 text-white text-lg"
                                 aria-label="Info"
                >
                    i
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content className="max-w-xs rounded-xl bg-slate-800 px-3 py-2 text-sm text-white shadow-xl"
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