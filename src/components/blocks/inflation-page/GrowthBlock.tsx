"use client";

import * as React from "react";
import { Info, SelectBox, PercentInput } from "@/lib/input-helper";

type Props = {
    inflationPct: number;             // напр. 0 | 2 | 2.2 | ...
    setInflationPct: (n: number) => void;
    growthPct: number;                // напр. 0 | 2.01 | 3.5 | ...
    setGrowthPct: (n: number) => void;
};

type InflKind = "none" | "ecb_2" | "euro_aug2024_22" | "custom";
type GroKind  = "none" | "custom";

const INFL_VALS: Record<InflKind, number> = {
    none: 0,
    ecb_2: 2.0,
    euro_aug2024_22: 2.2,
    custom: 2.0,          // при выборе Custom из селекта ставим 2%
};

const GROWTH_VALS: Record<GroKind, number> = {
    none: 0,
    custom: 3.5,          // при выборе Custom из селекта ставим 3.5%
};

const approx = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) < eps;

export default function GrowthBlock({
    inflationPct,
    setInflationPct,
    growthPct,
    setGrowthPct,
}: Props) {
    // kind синхронизируем с приходящими числами
    const [inflKind, setInflKind] = React.useState<InflKind>("none");
    const [groKind,  setGroKind]  = React.useState<GroKind>("none");

    React.useEffect(() => {
        if (approx(inflationPct, 0)) setInflKind("none");
        else if (approx(inflationPct, 2.0)) setInflKind("ecb_2");
        else if (approx(inflationPct, 2.2)) setInflKind("euro_aug2024_22");
        else setInflKind("custom");
    }, [inflationPct]);

    React.useEffect(() => {
        if (approx(growthPct, 0)) setGroKind("none");
        else setGroKind("custom");
    }, [growthPct]);

    return (
        <>
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">

                    {/* 1) Inflation rate */}
                    <div className="mt-2 grid grid-cols-[auto_1fr_auto] items-center gap-3">
                        <div className="flex items-center text-sm text-nowrap text-slate-800 font-normal">
                            Inflation rate <Info tooltip="Your expected annual rate of inflation." />
                        </div>

                        <SelectBox
                            value={inflKind}
                            onValueChange={(v) => {
                                const next = v as InflKind;
                                setInflKind(next);
                                setInflationPct(INFL_VALS[next] ?? 0);
                            }}
                            options={[
                                { value: "none", label: "None (0%)" },
                                { value: "ecb_2", label: "European Central Bank" },
                                { value: "euro_aug2024_22", label: "Aug 2024 Eurozone" },
                                { value: "custom", label: "Custom" }, // поставит 2%
                            ]}
                            placeholder="Choose..."
                        />

                        <PercentInput
                            value={inflKind === "none" ? 0 : inflationPct}
                            onChange={(n) => {
                                setInflKind("custom");
                                setInflationPct(n);
                            }}
                            max={1000}
                        />
                    </div>

                    {/* 2) Growth rate */}
                    <div className="mt-2 grid grid-cols-[auto_1fr_auto] items-center gap-3">
                        <div className="flex items-center text-sm text-nowrap text-slate-800 font-normal">
                            Growth rate <Info tooltip="Your expected annual growth rate, expressed as AER/APY." />
                        </div>

                        <SelectBox
                            value={groKind}
                            onValueChange={(v) => {
                                const next = v as GroKind;
                                setGroKind(next);
                                setGrowthPct(GROWTH_VALS[next] ?? 0);
                            }}
                            options={[
                                { value: "none", label: "None (0%)" },
                                { value: "custom", label: "Custom" }, // поставит 3.5%
                            ]}
                            placeholder="Choose..."
                        />

                        <PercentInput
                            value={groKind === "none" ? 0 : growthPct}
                            onChange={(n) => {
                                setGroKind("custom");
                                setGrowthPct(n);
                            }}
                        />
                    </div>

                </div>
            </div>
        </>
    );
}
