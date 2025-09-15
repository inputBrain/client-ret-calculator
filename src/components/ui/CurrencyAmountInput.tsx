"use client";

import React from "react";

function formatNumber(n: number) {
    if (!Number.isFinite(n)) return "";
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n);
}

function toNumber(raw: string) {
    const s = raw.replace(/[^\d.,]/g, "");
    const hasDot = s.includes(".");
    const hasComma = s.includes(",");

    let normalized = s;
    if (hasDot && hasComma) {
        normalized = s.replace(/,/g, "");
    } else if (!hasDot && hasComma) {
        normalized = s.replace(/\./g, "").replace(",", ".");
    }
    const n = parseFloat(normalized);
    return Number.isFinite(n) ? n : 0;
}

export default function CurrencyAmountInput({
                                                symbol,
                                                value,
                                                onChange,
                                                placeholder,
                                                className = "",
                                            }: {
    symbol: string;
    value: number;
    onChange: (n: number) => void;
    placeholder?: string;
    className?: string;
}) {
    const [text, setText] = React.useState<string>(formatNumber(value));
    const [isFocused, setIsFocused] = React.useState(false);

    React.useEffect(() => {
        if (!isFocused) setText(formatNumber(value));
    }, [value, isFocused]);


    return (
        <div
            className={`relative h-11 rounded-xl border border-slate-200 bg-white shadow-sm focus-within:outline-none focus-within:ring-4 focus-within:ring-indigo-200 ${className}`}
        >
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 select-none text-[15px] text-slate-500 font-bold">
                {symbol}
            </div>

            <input
                type="text"
                inputMode="decimal"
                value={text}
                placeholder={placeholder}
                onFocus={() => setIsFocused(true)}
                onBlur={() => { setIsFocused(false); setText(formatNumber(value)); }}
                onChange={(e) => {
                    const v = e.target.value;
                    setText(v);
                    onChange(toNumber(v));
                }}
                className="h-11 w-full rounded-xl border-0 outline-none px-4 pl-8 text-[15px] text-slate-800 placeholder:text-slate-400 bg-transparent "
            />
        </div>
    );
}
