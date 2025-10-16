import React, { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CurrencyDropdown } from "@/components/ui/CurrencyDropdown";
import { type Currency, isCurrency } from "@/lib/currency";
import { preset } from "@/lib/donation-helper";
import { type PaymentMethod } from "@/hooks/useDonationState";

interface AmountSelectorProps {
    method: PaymentMethod;
    amountInput: string;
    onAmountInputChange: (value: string) => void;
    finalAmount: number | null;
    onPresetClick: (amount: number) => void;
    amountSymbol: string;

    // Monobank
    monoCcy: Currency;
    onMonoCcyChange: (ccy: Currency) => void;
    monoAvailableMap: Record<string, string>;

    // PayPal
    paypalCcy: Currency;
    onPaypalCcyChange: (ccy: Currency) => void;
    paypalAvailableMap: Record<string, string>;
}

export function AmountSelector({
    method,
    amountInput,
    onAmountInputChange,
    finalAmount,
    onPresetClick,
    amountSymbol,
    monoCcy,
    onMonoCcyChange,
    monoAvailableMap,
    paypalCcy,
    onPaypalCcyChange,
    paypalAvailableMap,
}: AmountSelectorProps) {

    // ✅ Показувати dropdown валют
    const showCurrencyDropdown = method === "uah" || method === "paypal";

    return (
        <Card>
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Amount</h2>

            <div className="flex flex-wrap gap-2">
                {/* ✅ Preset кнопки */}
                {preset.map((amount) => (
                    <Button
                        key={amount}
                        variant="outline"
                        size="md"
                        isActive={finalAmount === amount}
                        onClick={() => onPresetClick(amount)}
                    >
                        {amount}
                    </Button>
                ))}

                {/* ✅ Custom інпут */}
                <div className="relative">
                    <input
                        aria-label="Custom amount"
                        inputMode="decimal"
                        type="text"
                        placeholder=""
                        value={amountInput}
                        onFocus={(e) => e.currentTarget.select()}
                        onChange={(e) => {
                            const raw = e.target.value.replace(/[^\d.,]/g, "");
                            onAmountInputChange(raw);
                        }}
                        style={{
                            width: `calc(${Math.max(6, amountInput.length)}ch + 2.75rem)`,
                        }}
                        className="flex h-11 w-24 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-[15px] text-slate-900 shadow-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 focus:outline-none"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
            {amountSymbol}
          </span>
                </div>

                {/* ✅ Currency Dropdown для Monobank */}
                {method === "uah" && (
                    <CurrencyDropdown
                        value={monoCcy}
                        onChange={(ccy) => isCurrency(ccy) && onMonoCcyChange(ccy)}
                        availableMap={monoAvailableMap}
                    />
                )}

                {/* ✅ Currency Dropdown для PayPal */}
                {method === "paypal" && (
                    <CurrencyDropdown
                        value={paypalCcy}
                        onChange={(ccy) => isCurrency(ccy) && onPaypalCcyChange(ccy)}
                        availableMap={paypalAvailableMap}
                    />
                )}
            </div>

            {/* ✅ Показуємо обрану суму */}
            <p className="mt-3 text-sm text-slate-600" aria-live="polite">
                Selected amount:{" "}
                <span className="font-semibold text-slate-900">
          {finalAmount ?? "—"}
        </span>{" "}
                {amountSymbol}
            </p>
        </Card>
    );
}