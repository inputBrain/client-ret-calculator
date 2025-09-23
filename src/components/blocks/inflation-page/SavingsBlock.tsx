"use client";

import React from "react";
import CurrencyAmountInput from "../../ui/CurrencyAmountInput";
import {Info, Thumb, Track} from "@/lib/input-helper";
import * as Slider from "@radix-ui/react-slider";




export default function SavingsBlock({
    currencySymbol,
    currentSavings,
    setCurrentSavings,
    sliderVal,
    setSliderVal,
}: {
    currencySymbol: string;
    currentSavings: number;
    setCurrentSavings: (n: number) => void;
    savingMonthly: number;
    setSavingMonthly: (n: number) => void;
    sliderVal: number;
    setSliderVal: (n: number) => void;
}) {

    const displayValue = (sliderVal / 10) * 10;

    return (
        <>
            {/* Rows */}
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">

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


                    <div className="mt-2 items-center">
                        <div className="flex items-center text-sm text-slate-800 font-normal gap-4">

                                <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold tabular-nums text-gray-900">
                                  {displayValue.toFixed(2)}%
                                </span>
                                </div>


                            <Slider.Root
                                className="relative flex h-10 w-full touch-none select-none items-center"
                                min={0}
                                max={100}
                                step={1}
                                value={[sliderVal]}
                                onValueChange={(vals) => setSliderVal(vals[0] ?? sliderVal)}
                                style={{["--radix-slider-thumb-transform" as any]: "translateX(-50%)"}}
                            >
                                <Track/>
                                <Thumb label="Withdrawal Rate" />
                            </Slider.Root>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
