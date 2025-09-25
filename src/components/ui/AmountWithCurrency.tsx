// AmountWithCurrency.tsx
import * as React from "react";
import {type Currency, getCurrencySymbol} from "@/lib/currency";
import { CurrencyDropdown } from "./CurrencyDropdown";

type Props = {
    amount: number | null;              // «истина» для Amount
    onAmountChange: (n: number | null) => void;
    currency: Currency;
    onCurrencyChange: (c: Currency) => void;
    placeholder?: string;
    // можно прокинуть доступность валют (например, от monoLinks)
    availableCurrencies?: Partial<Record<Currency, boolean>>;
};

const parseAmount = (v: string): number | null => {
    if (!v) return null;
    // поддержка "1 234,56" и "1234.56"
    const cleaned = v
        .replace(/\s+/g, "")
        .replace(",", ".")
        .replace(/[^\d.]/g, "");
    if (!cleaned) return null;
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
};

export function AmountWithCurrency({
    amount,
    onAmountChange,
    currency,
    onCurrencyChange,
    placeholder = "Amount",
    availableCurrencies,
}: Props) {
    const [raw, setRaw] = React.useState(
        amount != null ? String(amount) : ""
    );

    // синхронизация извне (например, сменили amount в родителе)
    React.useEffect(() => {
        const next = amount != null ? String(amount) : "";
        setRaw(next);
    }, [amount]);

    const symbol = getCurrencySymbol(currency);

    const options = (["UAH", "EUR", "USD"] as const).map((code) => ({
        code,
        available: availableCurrencies?.[code] !== false,
    }));

    return (
        <div className="flex items-stretch gap-2">
            {/* Сам инпут: аккуратный, без лишних отступов */}
            <div className="relative flex-1">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
          {symbol}
        </span>
                <input
                    inputMode="decimal"
                    pattern="[0-9]*[.,]?[0-9]*"
                    value={raw}
                    onChange={(e) => {
                        const v = e.target.value;
                        setRaw(v);
                        onAmountChange(parseAmount(v));
                    }}
                    placeholder={placeholder}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-8 pr-3 py-2 text-sm text-slate-900 shadow-sm
                     placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    aria-label="Amount"
                />
            </div>

            {/* Селект валют сразу после поля */}
            <CurrencyDropdown
                value={currency}
                onChange={onCurrencyChange}
                options={options}
                className="shrink-0"
            />
        </div>
    );
}
