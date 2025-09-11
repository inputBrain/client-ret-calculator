"use client";

import * as React from "react";
import * as Slider from "@radix-ui/react-slider";
import * as Select from "@radix-ui/react-select";
import * as Tooltip from "@radix-ui/react-tooltip";
import { ChevronDownIcon } from "@radix-ui/react-icons";


function clamp(n: number, min: number, max: number) {
    return Math.min(max, Math.max(min, n));
}

function Track() {
    return (
        <Slider.Track className="relative h-1 w-full flex-grow rounded-full bg-gray-200">
            <Slider.Range className="absolute h-full rounded-full bg-indigo-500" />
        </Slider.Track>
    );
}

function Thumb({ label }: { label: string }) {
    return (
        <Slider.Thumb
            aria-label={label}
            className="relative h-2 w-2 rounded-full bg-indigo-600 shadow-lg
                 ring-6 ring-indigo-500
                 hover:bg-indigo-700 active:scale-95
                 focus-visible:ring-6 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            style={{ transform: "translateX(-50%)" }}
        />
    );
}

function Row({
     label,
     value,
     onChange,
}: {
    label: string;
    value: number;
    onChange: (v: number) => void;
}) {
    return (
        <div className="-mx-3 flex min-h-12 items-center justify-between gap-1 rounded bg-background-interactive-tertiary px-3 py-2 [&_>_*:first-child]:flex-[1_1_30%] [&_>_*:nth-child(2)]:flex-[1_1_70%]">

            <div className="mb-2 flex items-center gap-3">
                <span className="text-sm text-gray-600 font-medium">{label}</span>
                    <span className="text-sm font-semibold tabular-nums text-gray-900">
                        {Math.round(value)}%
                    </span>
            </div>

            <Slider.Root
                className="relative flex h-10 w-full touch-none select-none items-center"
                min={0}
                max={100}
                step={1}
                value={[value]}
                onValueChange={(vals) => onChange(vals[0] ?? value)}
                style={{ ["--radix-slider-thumb-transform" as any]: "translateX(-50%)" }}
            >
                <Track />
                <Thumb label={label} />
            </Slider.Root>
        </div>
    );
}

export function AllocationTriple({
     stocksPct,
     fixedPct,
     setStocksPct,
     setFixedPct,
}: {
    stocksPct: number;
    fixedPct: number;
    setStocksPct: (n: number) => void;
    setFixedPct: (n: number) => void;
}) {
    const [stocksRateKind, setStocksRateKind] = React.useState<"none" | "custom">("none");
    const [stocksRate, setStocksRate] = React.useState(0);

    const [fixedRateKind, setFixedRateKind] = React.useState<"none" | "lightyear" | "custom">(
        "lightyear"
    );
    const [fixedRate, setFixedRate] = React.useState(2.01);

    const cashPct = React.useMemo(
        () => clamp(100 - stocksPct - fixedPct, 0, 100),
        [stocksPct, fixedPct]
    );


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
        const totalNow = stocksPct + fixedPct + cashPct;
        const needReduce = totalNow - (100 - nextCash + nextCash);
        const deltaCash = nextCash - cashPct;

        if (deltaCash === 0) return;

        if (nextCash > cashPct) {

            let give = nextCash - cashPct;
            let takeFromStocks = Math.min(give, stocksPct);
            give -= takeFromStocks;
            let takeFromFixed = Math.min(give, fixedPct);
            give -= takeFromFixed;

            setStocksPct(stocksPct - takeFromStocks);
            setFixedPct(fixedPct - takeFromFixed);

        } else {
            let free = cashPct - nextCash;

            const addToStocks = free;
            setStocksPct(clamp(stocksPct + addToStocks, 0, 100));
        }
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Stocks / ETFs */}
            <div className="flex flex-col gap-3">
                <h6 className="text-sm text-shadow-2xs font-bold text-gray-800">Stocks / ETFs</h6>
                <Row label="Allocation:" value={stocksPct} onChange={onStocks} />

                {/* Growth rate line */}
                <div className="mt-2 grid grid-cols-[auto_1fr_auto] items-center gap-3">
                    <div className="flex items-center text-sm text-slate-600">
                        Growth rate <Info tooltip="Your expected annual growth rate (market gains), expressed as AER/APY." />
                    </div>

                    <SelectBox
                        value={stocksRateKind}
                        onValueChange={(v) => {
                            const val = v as "none" | "custom";
                            setStocksRateKind(val);
                            if (val === "none") setStocksRate(0);
                        }}
                        options={[
                            { value: "none", label: "None (0%)" },
                            { value: "custom", label: "Custom" },
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

            <div className="flex flex-col gap-3">
                <h6 className="text-sm text-shadow-2xs font-bold text-gray-800">Savings Account / Bonds</h6>
                <Row label="Allocation:" value={fixedPct} onChange={onFixed} />

                <div className="mt-2 grid grid-cols-[auto_1fr_auto] items-center gap-3">
                    <div className="flex items-center text-sm text-slate-600">
                        Growth rate <Info tooltip="Your expected annual interest rate, expressed as AER/APY." />
                    </div>

                    <SelectBox
                        value={fixedRateKind}
                        onValueChange={(v) => {
                            const val = v as "none" | "lightyear" | "custom";
                            setFixedRateKind(val);
                            if (val === "none") setFixedRate(0);
                            if (val === "lightyear") setFixedRate(2.01);
                        }}
                        options={[
                            { value: "none", label: "None (0%)" },
                            { value: "lightyear", label: "Lightyear Savings (2.01%)" },
                            { value: "custom", label: "Custom" },
                        ]}
                        placeholder="Choose..."
                    />

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
                <h6 className="text-sm text-shadow-2xs font-bold text-gray-800">Cash</h6>
                <Row label="Allocation:" value={cashPct} onChange={onCash} />

                <div className="mt-2 grid grid-cols-[auto_1fr] items-center gap-3">
                    <div className="flex items-center text-sm text-slate-600">
                        Allocation
                        <Info tooltip="How much of your savings you'll keep as cash (i.e. at 0% growth)" />
                    </div>
                </div>
            </div>
        </div>
    );
}








function Info({ tooltip }: { tooltip: string }) {
    return (
        <Tooltip.Provider delayDuration={200}>
            <Tooltip.Root>
                <Tooltip.Trigger
                    className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white text-xs trans"
                    aria-label="Info"
                >
                    i
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content
                        className="max-w-xs rounded-xl bg-slate-900 px-3 py-2 text-sm text-white shadow-xl"
                        side="top"
                        sideOffset={8}
                    >
                        {tooltip}
                        <Tooltip.Arrow className="fill-slate-900" />
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
                className="inline-flex h-11 min-w-[220px] items-center justify-between gap-3 rounded-xl
                   border border-slate-200 bg-white px-4 text-[15px] text-slate-800 shadow-sm
                   focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
                aria-label="Select option"
            >
                <Select.Value placeholder={placeholder} />
                <Select.Icon>
                    <ChevronDownIcon />
                </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
                <Select.Content
                    className="z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
                    position="popper"
                    sideOffset={8}
                >
                    <Select.Viewport className="p-1 min-w-[220px]">
                        {options.map((o) => (
                            <Select.Item
                                key={o.value}
                                value={o.value}
                                className="relative flex cursor-pointer select-none items-center justify-between
                                           rounded-xl px-4 py-3 text-[15px] text-slate-800
                                           outline-none data-[highlighted]:bg-indigo-50"
                            >
                                <Select.ItemText>{o.label}</Select.ItemText>
                                <Select.ItemIndicator>
                                    <span className="ml-4 inline-flex h-5 w-5 items-center justify-center rounded-full border border-indigo-200">
                                    <span className="h-3 w-3 rounded-full bg-indigo-600" />
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

function PercentInput({
    value,
    onChange,
}: {
    value: number;
    onChange: (n: number) => void;
}) {
    return (
        <div
            className="flex h-11 w-24 items-center justify-center rounded-xl border border-slate-200 bg-white
                 px-3 text-[15px] text-slate-900 shadow-sm focus-within:ring-4 focus-within:ring-indigo-200"
        >
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

