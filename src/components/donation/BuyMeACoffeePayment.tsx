import React, { useState, useMemo } from "react";
import { SiBuymeacoffee } from "react-icons/si";
import { Coffee } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface BuyMeACoffeePaymentProps {
    bmacUrl: string;
    amount: number | null;
}

const iconCls = "h-4 w-4";

const COFFEE_PRICE = 5; // $5 за одну каву

const COFFEE_PRESETS = [1, 3, 5, 10];

export function BuyMeACoffeePayment({
    bmacUrl,
    amount,
}: BuyMeACoffeePaymentProps) {
    const [coffeeCount, setCoffeeCount] = useState<number>(1);
    const [customInput, setCustomInput] = useState<string>("");

    const totalAmount = useMemo(() => {
        return coffeeCount * COFFEE_PRICE;
    }, [coffeeCount]);

    const customCount = useMemo(() => {
        const num = parseInt(customInput);
        return Number.isFinite(num) && num > 0 ? num : null;
    }, [customInput]);

    const isPresetActive = (count: number) => {
        return !customInput && coffeeCount === count;
    };

    return (
        <Card>
            <CardHeader
                icon={<SiBuymeacoffee className={iconCls} />}
                title="Buy Me a Coffee"
                description="Support with a virtual coffee ☕"
            />

            <div className="mb-6">
                <label className="mb-3 block text-sm font-medium text-slate-700">
                    How many coffees?
                </label>
                <div className="flex flex-wrap gap-2">
                    {/* Preset кнопки */}
                    {COFFEE_PRESETS.map((count) => (
                        <button
                            key={count}
                            onClick={() => {
                                setCoffeeCount(count);
                                setCustomInput(""); // скидаємо custom
                            }}
                            className={`group relative rounded-xl px-4 py-3 text-sm font-medium border transition-all ${
                                isPresetActive(count)
                                    ? "border-yellow-400 bg-yellow-50 text-yellow-900 shadow-sm scale-105"
                                    : "border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                            }`}
                        >
                            {/* Іконка кави */}
                            <div className="flex items-center gap-2">
                                <Coffee
                                    className={`h-5 w-5 transition-transform ${
                                        isPresetActive(count) ? "text-yellow-600" : "text-slate-400"
                                    }`}
                                />
                                <span className="font-bold">×{count}</span>
                            </div>
                            {/* Ціна під іконкою */}
                            <div className={`text-xs mt-1 ${
                                isPresetActive(count) ? "text-yellow-700" : "text-slate-500"
                            }`}>
                                ${count * COFFEE_PRICE}
                            </div>
                        </button>
                    ))}

                    {/* Custom інпут */}
                    <div className="relative group">
                        <button
                            onClick={() => {
                                // Фокус на інпут при кліку на кнопку
                                const input = document.getElementById("custom-coffee-input") as HTMLInputElement;
                                input?.focus();
                            }}
                            className={`rounded-xl px-4 py-3 text-sm font-medium border transition-all ${
                                customInput
                                    ? "border-yellow-400 bg-yellow-50 text-yellow-900 shadow-sm"
                                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <Coffee
                                    className={`h-5 w-5 ${
                                        customInput ? "text-yellow-600" : "text-slate-400"
                                    }`}
                                />
                                <input
                                    id="custom-coffee-input"
                                    type="number"
                                    min="1"
                                    max="1000"
                                    placeholder="Custom"
                                    value={customInput}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setCustomInput(val);
                                        const num = parseInt(val);
                                        if (Number.isFinite(num) && num > 0) {
                                            setCoffeeCount(num);
                                        }
                                    }}
                                    onFocus={(e) => e.currentTarget.select()}
                                    className="w-16 bg-transparent text-center outline-none placeholder:text-slate-400"
                                />
                            </div>
                            {customCount && (
                                <div className="text-xs mt-1 text-yellow-700">
                                    ${customCount * COFFEE_PRICE}
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* ✅ Відображення обраного */}
            <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex">
                            {/* Показуємо іконки кавочок */}
                            {Array.from({ length: Math.min(coffeeCount, 5) }).map((_, i) => (
                                <Coffee
                                    key={i}
                                    className="h-5 w-5 text-yellow-600 -ml-1 first:ml-0"
                                />
                            ))}
                            {coffeeCount > 5 && (
                                <span className="ml-1 text-sm font-semibold text-yellow-700">
                  +{coffeeCount - 5}
                </span>
                            )}
                        </div>
                        <span className="text-sm text-slate-700">
              {coffeeCount === 1 ? "1 coffee" : `${coffeeCount} coffees`}
            </span>
                    </div>
                    <span className="text-lg font-bold text-yellow-900">
            ${totalAmount}
          </span>
                </div>
            </div>

            <Button
                variant="bmac"
                size="lg"
                disabled={!bmacUrl}
                onClick={() => {
                    if (bmacUrl) {
                        // Додаємо кількість кавочок до URL якщо BMAC підтримує
                        // Наприклад: https://www.buymeacoffee.com/username?n=3
                        const url = bmacUrl.includes("?")
                            ? `${bmacUrl}&n=${coffeeCount}`
                            : `${bmacUrl}?n=${coffeeCount}`;
                        window.open(url, "_blank", "noopener,noreferrer");
                    }
                }}
                className="w-full sm:w-auto"
            >
                <SiBuymeacoffee className={iconCls} />
                Buy {coffeeCount === 1 ? "Me" : `${coffeeCount}`} Coffee{coffeeCount > 1 ? "s" : ""}
            </Button>

            <p className="mt-3 text-xs text-slate-600">
                💛 Each coffee is ${COFFEE_PRICE}. Your support means a lot!
            </p>
        </Card>
    );
}