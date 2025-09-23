"use client";

import React from "react";
import CurrencyAmountInput from "../../ui/CurrencyAmountInput";
import PercentInputLikeInInflation, {Info, PercentInput, SelectBox, Thumb, Track} from "@/lib/input-helper";
import * as Slider from "@radix-ui/react-slider";




export default function GrowthBlock({
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



                    <div className="mt-2 grid grid-cols-[auto_1fr_auto] items-center gap-3">
                        <div className="flex items-center text-sm text-nowrap text-slate-800 font-normal">
                            Inflation rate{" "}
                            <Info tooltip="Your expected annual rate of inflation." />
                        </div>

                        <SelectBox
                            value={kind}
                            onValueChange={onKindChange}
                            options={[
                                { value: "none", label: "None (0%)" },
                                { value: "ecb_target_2", label: "European Central Bank target (2%)" },
                                { value: "eurozone_aug2024_22", label: "Aug 2024 Eurozone inflation (2.2%)" },
                                { value: "custom", label: "Custom" },
                            ]}
                            placeholder="Choose..."
                        />

                        <PercentInputLikeInInflation
                            value={inputValue}
                            onChange={(n) => {
                                setInflationPct(n);
                            }}
                            min={0}
                            max={200}
                            step={0.1}
                            className="w-36 sm:w-40"
                        />
                    </div>



                    <div className="mt-2 grid grid-cols-[auto_1fr_auto] items-center gap-3">
                        <div className="flex items-center text-sm text-nowrap text-slate-800 font-normal">
                            Growth rate <Info tooltip="Your expected annual interest rate, expressed as AER/APY."/>
                        </div>

                        {fixedPresets.length === 0 ? (
                            <div className="h-11 min-w-[220px] text-nowrap rounded-xl border border-slate-200 bg-slate-50 px-4 text-[15px] text-slate-400 flex items-center">
                                Custom
                            </div>
                        ) : (
                            <SelectBox
                                value={fixedRateKind}
                                onValueChange={(v) => {
                                    const val = v as FixedKind;
                                    setFixedRateKind(val);
                                    if (val === "none") setFixedRate(0);
                                    if (val === "preset") setFixedRate(fixedPresets[0].rate);
                                }}
                                options={[
                                    {value: "none", label: "None (0%)"},
                                    ...fixedPresets.map((p) => ({
                                        value: "preset",
                                        label: `${p.label} (${p.rate.toFixed(2)}%)`,
                                    })),
                                    {value: "custom", label: "Custom"},
                                ]}
                                placeholder="Choose..."
                            />
                        )}

                        <PercentInput
                            value={fixedRateKind === "none" ? 0 : fixedRate}
                            onChange={(n) => {
                                setFixedRateKind("custom");
                                setFixedRate(n);
                            }}
                        />
                    </div>

                </div>
            </div>
        </>
    );
}
