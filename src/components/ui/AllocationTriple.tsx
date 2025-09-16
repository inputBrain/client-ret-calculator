// src/components/ui/AllocationTriple.tsx
"use client";

import * as React from "react";
import * as Slider from "@radix-ui/react-slider";
import * as Select from "@radix-ui/react-select";
import * as Tooltip from "@radix-ui/react-tooltip";
import {ChevronDownIcon} from "@radix-ui/react-icons";
import {type Currency, CURRENCY_META} from "@/lib/currency";

function clamp(n: number, min: number, max: number) {
    return Math.min(max, Math.max(min, n));
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

export function AllocationTriple({
    currency,
    stocksPct,
    fixedPct,
    setStocksPct,
    setFixedPct,

    stocksRateKind,
    setStocksRateKind,
    stocksRate,
    setStocksRate,
    fixedRateKind,
    setFixedRateKind,
    fixedRate,
    setFixedRate,
}: {
    currency: Currency;
    stocksPct: number;
    fixedPct: number;
    setStocksPct: (n: number) => void;
    setFixedPct: (n: number) => void;

    stocksRateKind: "none" | "custom";
    setStocksRateKind: (v: "none" | "custom") => void;
    stocksRate: number;
    setStocksRate: (n: number) => void;

    fixedRateKind: "none" | "custom" | "preset";
    setFixedRateKind: (v: "none" | "custom" | "preset") => void;
    fixedRate: number;
    setFixedRate: (n: number) => void;
}) {
    const fixedPresets = CURRENCY_META[currency].fixedPresets;
    type FixedKind = "none" | "custom" | "preset";

    React.useEffect(() => {
        if (fixedPresets.length) {
            setFixedRateKind("preset");
            setFixedRate(fixedPresets[0].rate);
        } else {
            setFixedRateKind("custom");
            setFixedRate(0);
        }
    }, [currency]);

    const cashPct = React.useMemo(() => clamp(100 - stocksPct - fixedPct, 0, 100), [stocksPct, fixedPct]);

    const onStocks = (next: number) => {
        next = clamp(next, 0, 100);
        const remain = 100 - next;
        const fixed = clamp(fixedPct, 0, remain);
        setFixedPct(fixed);
        setStocksPct(next);
    };
    const onFixed = (next: number) => {
        next = clamp(next, 0, 100);
        const need = Math.max(0, stocksPct + fixedPct + cashPct - 100 + (next - fixedPct));
        if (need <= 0) {
            setFixedPct(next);
            return;
        }
        let takeFromCash = Math.min(need, cashPct);
        let left = need - takeFromCash;
        let takeFromStocks = Math.min(left, stocksPct);
        left -= takeFromStocks;
        setFixedPct(next);
        setStocksPct(stocksPct - takeFromStocks);
    };
    const onCash = (nextCash: number) => {
        nextCash = clamp(nextCash, 0, 100);
        const deltaCash = nextCash - cashPct;
        if (deltaCash === 0) return;
        if (nextCash > cashPct) {
            let give = nextCash - cashPct;
            let takeFromStocks = Math.min(give, stocksPct);
            give -= takeFromStocks;
            let takeFromFixed = Math.min(give, fixedPct);
            setStocksPct(stocksPct - takeFromStocks);
            setFixedPct(fixedPct - takeFromFixed);
        } else {
            let free = cashPct - nextCash;
            setStocksPct(clamp(stocksPct + free, 0, 100));
        }
    };

    const sr = stocksRateKind === "none" ? 0 : stocksRate;     // % для акций
    const fr = fixedRateKind === "none" ? 0 : fixedRate;       // % для депозита/облигаций
    const effectiveRate = React.useMemo(() => {
        // (52 * 11 + 19 * 55) / 100 = 16.17
        return (stocksPct * sr + fixedPct * fr) / 100;
    }, [stocksPct, fixedPct, sr, fr]);
    const formulaText = `( ${Math.round(stocksPct)}% × ${sr.toFixed(2)} ) + ( ${Math.round(fixedPct)}% × ${fr.toFixed(2)} ) = ${effectiveRate.toFixed(2)}`;


    return (
        <div className="flex flex-col gap-8">
            {/* Stocks / ETFs */}
            <div className="flex flex-col gap-3">
                <h6 className="text-sm font-semibold text-gray-800 text-shadow-2xs">Stocks / ETFs</h6>
                <Row label="Allocation:" value={stocksPct} onChange={onStocks}/>

                <div className="mt-2 grid grid-cols-[auto_1fr_auto] items-center gap-3">
                    <div className="flex items-center text-sm text-nowrap text-slate-800 font-normal">
                        Growth rate <Info tooltip="Your expected annual growth rate (market gains), expressed as AER/APY."/>
                    </div>


                    <SelectBox
                        value={stocksRateKind}
                        onValueChange={(v) => {
                            const val = v as "none" | "custom";
                            setStocksRateKind(val);
                            if (val === "none") setStocksRate(0);
                        }}
                        options={[
                            {value: "none", label: "None (0%)"},
                            {value: "custom", label: "Custom"},
                        ]}
                        placeholder="Choose..."
                    />

                    <PercentInput
                        value={stocksRateKind === "none" ? 0 : stocksRate}
                        onChange={(n) => {
                            setStocksRateKind("custom");
                            setStocksRate(n);
                        }}
                    />
                </div>
            </div>

            {/* Savings / Bonds */}
            <div className="flex flex-col gap-3">
                <h6 className="text-sm font-semibold text-gray-800 text-shadow-2xs">Savings Account / Bonds</h6>
                <Row label="Allocation:" value={fixedPct} onChange={onFixed}/>

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

            {/* Cash */}
            <div className="flex flex-col gap-3">
                <h6 className="text-sm text-shadow-2xs font-semibold text-gray-800">Cash</h6>
                <Row label="Allocation:" value={cashPct} onChange={onCash}/>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 text-shadow-2xs">
                    <span>Effective overall rate of return:</span>
                    <span className="tabular-nums">{effectiveRate.toFixed(2)}%</span>
                    <Info tooltip={formulaText}/>
                </div>
                <p className="text-xs text-slate-600">
                    Returns may vary. You are responsible for the rate you enter - we make no assessment on how likely you are to secure your chosen rate. Calculations do not take into account the
                    effect of costs, inflation or tax. For simplicity, this calculator assumes your chosen rates remain stable throughout the selected duration, and that all present and future savings
                    follow your chosen allocation.
                </p>
            </div>
        </div>
    );
}

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
                className="inline-flex h-11 min-w-[220px] items-center justify-between  rounded-xl border text-nowrap border-slate-200 bg-white px-4 text-[15px] text-slate-800 shadow-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
                aria-label="Select option"
            >
                <Select.Value placeholder={placeholder}/>
                <Select.Icon>
                    <ChevronDownIcon/>
                </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
                <Select.Content
                    className="z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
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
                  <span
                      className="ml-4 inline-flex h-5 w-5 items-center justify-center rounded-full border border-indigo-200">
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

function PercentInput({value, onChange}: { value: number; onChange: (n: number) => void }) {
    return (
        <div
            className="flex h-11 w-24 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-[15px] text-slate-900 shadow-sm focus-within:ring-4 focus-within:ring-indigo-200">
            <input
                type="number"
                step="0.01"
                value={Number.isFinite(value) ? value : 0}
                onChange={(e) => onChange(parseFloat(e.target.value || "0"))}
                className="w-full bg-transparent text-center outline-none"
            />
            <span className="pl-1 text-slate-500">%</span>
        </div>
    );
}
