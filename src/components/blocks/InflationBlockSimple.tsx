"use client";

import * as React from "react";
import { Info, SelectBox } from "@/lib/input-helper";
import PercentInputLikeInInflation from "@/lib/input-helper";

type Props = {
    inflationPct: number;                  // число, например 0 | 2 | 2.2 | ...
    setInflationPct: (n: number) => void;  // сеттер из родителя
    className?: string;
};

type InflKind = "none" | "ecb_target_2" | "eurozone_aug2024_22" | "custom";

const PRESETS: Record<Exclude<InflKind, "custom">, number> = {
    none: 0,
    ecb_target_2: 2.0,
    eurozone_aug2024_22: 2.2,
};

export default function InflationBlockSimple({ inflationPct, setInflationPct, className }: Props) {

    const kind: InflKind = React.useMemo(() => {
        const val = Number(inflationPct ?? 0);
        if (almost(val, PRESETS.none)) return "none";
        if (almost(val, PRESETS.ecb_target_2)) return "ecb_target_2";
        if (almost(val, PRESETS.eurozone_aug2024_22)) return "eurozone_aug2024_22";
        return "custom";
    }, [inflationPct]);

    const onKindChange = (next: string) => {
        const v = next as InflKind;
        if (v === "custom") {
            return;
        }
        setInflationPct(PRESETS[v] ?? 0);
    };

    const inputValue = kind === "custom" ? inflationPct : PRESETS[kind];

    return (
        <div className={className}>
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
        </div>
    );
}

// небольшая утилита для сравнения с плавающей точкой
function almost(a: number, b: number, eps = 1e-9) {
    return Math.abs(a - b) < eps;
}
