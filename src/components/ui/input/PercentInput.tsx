"use client";
import React from "react";
import { NumberInput } from "./NumberInput";

export function PercentInput({
                                 value,
                                 onChange,
                             }: {
    value: number;
    onChange: (n: number) => void;
}) {
    return (
        <NumberInput
            step={0.01}
            value={Number.isFinite(value) ? value : 0}
            onChange={(e) => onChange(parseFloat(e.target.value || "0"))}
        >

        </NumberInput>
    );
}


export function PercentField({
                                 value,
                                 onChange,
                             }: {
    value: number;
    onChange: (n: number) => void;
}) {
    return (
        <div className="relative">
            <PercentInput value={value} onChange={onChange} />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
        %
      </span>
        </div>
    );
}
export default PercentField;
