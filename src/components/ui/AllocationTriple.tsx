"use client";

import * as React from "react";
import * as Slider from "@radix-ui/react-slider";

function clamp(n: number, min: number, max: number) {
    return Math.min(max, Math.max(min, n));
}

function Track() {
    return (
        <Slider.Track className="relative h-1 w-full flex-grow rounded-full bg-gray-200">
            <Slider.Range className="absolute h-full rounded-full bg-purple-600" />
        </Slider.Track>
    );
}

function Thumb({ label }: { label: string }) {
    return (
        <Slider.Thumb
            aria-label={label}
            className="h-16 w-16 rounded-full bg-purple-600 shadow-md outline-none transition
                 hover:bg-purple-700 active:scale-95
                 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
            style={{ transform: "var(--radix-slider-thumb-transform)" }}
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
        <div className="flex flex-col gap-6">
            <h6 className="text-sm text-shadow-2xs font-bold text-gray-800">
                Stocks / ETFs
            </h6>
            <Row label="Allocation:" value={stocksPct} onChange={onStocks} />

            {/*//TODO:  Select: 2 options: None(0%) |  Custom*/}


            <h6 className="text-sm text-shadow-2xs font-bold text-gray-800">
                Savings Account / Bonds
            </h6>
            <Row label="Allocation:" value={fixedPct} onChange={onFixed} />

            {/*//TODO:  Select: 3 options: None(0%) | Lightyear Savings (2.01%) | Custom*/}


            <h6 className="text-sm text-shadow-2xs font-bold text-gray-800">
                Cash
            </h6>
            <Row label="Cash" value={cashPct} onChange={onCash} />
        </div>
    );
}
