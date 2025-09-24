"use client";

import React from "react";
import CurrencyAmountInput from "../../ui/CurrencyAmountInput";
import { Info, Thumb, Track } from "@/lib/input-helper";
import * as Slider from "@radix-ui/react-slider";

type Props = {
    currencySymbol: string;
    totalSavings: number;
    setTotalSavings: (n: number) => void;
    years: number; // 0..80
    setYears: (n: number) => void;
};

export default function SavingsBlock({
    currencySymbol,
    totalSavings,
    setTotalSavings,
    years,
    setYears,
}: Props) {
    return (
        <>
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                    {/* 1) Total savings */}
                    <div className="mt-2 grid grid-cols-3 items-center gap-2">
                        <div className="flex items-center text-sm text-nowrap text-slate-800 font-normal">
                            Total savings
                            <Info tooltip="How much you've already saved. Don't include your pension or illiquid assets like property." />
                        </div>

                        <CurrencyAmountInput
                            symbol={currencySymbol}
                            value={totalSavings}
                            onChange={setTotalSavings}
                            placeholder="0"
                            className="col-span-2"
                        />
                    </div>

                    {/* 2) How long for? {years} years (slider 0..80, step 1) */}
                    <div className="mt-2 items-center">
                        <div className="flex items-center text-sm text-slate-800 font-normal gap-4">
                            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tabular-nums text-gray-900">
                  How long for? {years} years
                </span>
                            </div>

                            <Slider.Root
                                className="relative flex h-10 w-full touch-none select-none items-center"
                                min={0}
                                max={80}
                                step={1}
                                value={[years]}
                                onValueChange={(vals) => setYears(vals[0] ?? years)}
                                style={{ ["--radix-slider-thumb-transform" as any]: "translateX(-50%)" }}
                            >
                                <Track />
                                <Thumb label="How long for?" />
                            </Slider.Root>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
