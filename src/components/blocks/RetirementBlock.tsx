"use client";

import React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import CurrencyAmountInput from "../ui/CurrencyAmountInput";
import * as Slider from "@radix-ui/react-slider";
import * as Select from "@radix-ui/react-select";
import {ChevronDownIcon} from "@radix-ui/react-icons";

export function RetirementBlock({
    currencySymbol,
    annualSpend,
    setAnnualSpend,
    mode,
    setMode,
    sliderVal, setSliderVal,
}: {
    currencySymbol: string;
    annualSpend: number;
    setAnnualSpend: (n: number) => void;
    mode: "withdrawal" | "life";
    setMode: (m: "withdrawal" | "life") => void;
    sliderVal: number;
    setSliderVal: (n: number) => void;
}) {
    // const [mode, setMode] = React.useState<"withdrawal" | "life">("withdrawal");
    // const [sliderVal, setSliderVal] = React.useState<number>(10);

    const displayValue =
        mode === "withdrawal"
            ? (sliderVal / 10) * 10
            : 10 + Math.round((sliderVal / 100) * 110);

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">

                <div className="mt-2 grid grid-cols-3 items-center gap-2">
                    <div className="flex items-center text-sm text-nowrap text-slate-800 font-normal">
                        Projection mode
                        <Info tooltip="How much you expect to spend every year during retirement"/>
                    </div>

                    <SelectBox
                        value={mode}
                        onValueChange={(v) => setMode(v as "withdrawal" | "life")}
                        options={[
                            {value: "withdrawal", label: "Withdrawal Rate"},
                            {value: "life", label: "Life Expectancy"},
                        ]}
                        placeholder="Choose..."
                    />
                    <div/>
                </div>

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

                <div className="mt-2 items-center">
                    <div className="flex items-center text-sm text-slate-800 font-normal gap-4">
                        <span className="text-sm font-medium text-gray-600">
                          {mode === "withdrawal" ? "Withdrawal Rate" : "Life Expectancy"}
                        </span>
                        {mode === "withdrawal" ? (
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold tabular-nums text-gray-900">
                                  {displayValue.toFixed(2)}%
                                </span>
                            </div>
                        ) : (
                            <span className="text-sm font-semibold tabular-nums text-gray-900">
                                 {Math.round(displayValue)}
                            </span>
                        )}

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
                            <Thumb label={mode === "withdrawal" ? "Withdrawal Rate" : "Life Expectancy"}/>
                        </Slider.Root>
                    </div>

                </div>
                <p className="text-xs text-slate-600">
                    Withdrawal rate is the percentage of your savings that you plan to spend each year of retirement. 4% is a common target for a 30 year retirement. Alternatively, you can determine your FIRE target based on how old you plan to live until!
                </p>
            </div>
        </div>
    );
}


function Track() {
    return (
        <Slider.Track className="relative h-1.5 w-full flex-grow rounded-full bg-gray-200">
            <Slider.Range className="absolute h-full rounded-full bg-indigo-600"/>
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

function SelectBox({
    value,
    onValueChange,
    options,
    placeholder,
}: {
    value: string;
    onValueChange: (v: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
}) {
    return (
        <Select.Root value={value} onValueChange={onValueChange}>
            <Select.Trigger
                className=" inline-flex items-center justify-between h-11 col-span-2 rounded-xl border border-slate-200 bg-white px-4 text-[15px] text-slate-800 shadow-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
                aria-label="Select option"
            >
                <Select.Value placeholder={placeholder}/>
                <Select.Icon>
                    <ChevronDownIcon/>
                </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
                <Select.Content
                    className="z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl min-w-[290px]"
                    position="popper"
                    sideOffset={8}
                >
                    <Select.Viewport className="min-w-[220px] p-1">
                        {options.map((o, i) => (
                            <Select.Item
                                key={`${o.value}-${i}`}
                                value={o.value}
                                className="group relative flex cursor-pointer select-none items-center justify-between rounded-xl px-4 py-3 text-[15px] text-slate-800 outline-none data-[highlighted]:bg-indigo-50"
                            >
                                <Select.ItemText>{o.label}</Select.ItemText>
                                <Select.ItemIndicator>
                                  <span className="ml-4 inline-flex h-5 w-5 items-center justify-center rounded-full border border-indigo-200">
                                    <span className="h-3 w-3 rounded-full bg-indigo-600"/>
                                  </span>
                                </Select.ItemIndicator>
                            </Select.Item>
                        ))}
                    </Select.Viewport>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    );
}
