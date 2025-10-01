// src/components/ui/AllocationTriple.tsx
"use client";

import * as React from "react";
import {type Currency, CURRENCY_META} from "@/lib/currency";
import {PercentInput, Row, Info, SelectBox} from "@/lib/input-helper";

function clamp(n: number, min: number, max: number) {
    return Math.min(max, Math.max(min, n));
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
    type FixedKind = "none" | "custom";

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
                <h6 className="text-sm font-semibold text-gray-800 text-shadow-2xs">Savings Account / Bonds / Dividends</h6>
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
                            }}
                            options={[
                                {value: "none", label: "None (0%)"},
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