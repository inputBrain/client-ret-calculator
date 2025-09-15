"use client";

import React from "react";

function formatNumber(n: number) {
    if (!Number.isFinite(n)) return "";
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n);
}

function toNumber(raw: string) {
    // выкидываем всё кроме цифр/., заменяем запятую на точку
    const s = raw.replace(/[^\d.,]/g, "").replace(",", ".");
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : 0;
}

export default function CurrencyAmountInput({
                                                symbol,
                                                value,
                                                onChange,
                                                placeholder,
                                            }: {
    symbol: string;
    value: number;
    onChange: (n: number) => void;
    placeholder?: string;
}) {
    const [text, setText] = React.useState<string>(formatNumber(value));

    React.useEffect(() => {
        setText(formatNumber(value));
    }, [value]);

    return (
        <div className="focus-within:-m-px relative min-h-12 rounded-lg border border-border-secondary focus-within:border-2 focus-within:border-content-interactive-tertiary focus-within:shadow-[0_0_0_4px_rgb(var(--content-interactive-tertiary)/0.15)]">
            {/* префикс-символ */}
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 select-none text-sm text-slate-500">
                {symbol}
            </div>

            <input
                inputMode="decimal"
                className="flex h-full w-full items-center rounded-lg border-0 px-3 pl-7 py-[14px] text-sm text-shadow-2xs text-content outline-none placeholder:text-content-tertiary"
                type="text"
                value={text}
                placeholder={placeholder}
                onChange={(e) => {
                    setText(e.target.value);
                    onChange(toNumber(e.target.value));
                }}
                onBlur={() => setText(formatNumber(value))}
            />
        </div>
    );
}
