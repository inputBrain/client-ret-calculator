import React, { useState, useMemo } from "react";
import Image from "next/image";
import { type Currency, CURRENCY_META } from "@/lib/currency";
import { useClickOutside } from "@/hooks/useClickOutside";

interface CurrencyDropdownProps {
    value: Currency;
    onChange: (c: Currency) => void;
    availableMap?: Partial<Record<Currency, string | boolean>>;
    className?: string;
}

export function CurrencyDropdown({
    value,
    onChange,
    availableMap,
    className = "",
}: CurrencyDropdownProps) {
    const [open, setOpen] = useState(false);

    // ✅ Використовуємо наш hook замість useEffect
    const ref = useClickOutside<HTMLDivElement>(() => setOpen(false), open);

    // ✅ Список доступних валют
    const currencies = useMemo(() => {
        return (["UAH", "EUR", "USD"] as const).map((code) => ({
            code,
            available: availableMap ? !!availableMap[code] : true,
        }));
    }, [availableMap]);

    return (
        <div ref={ref} className={`relative ${className}`}>
            {/* ✅ Кнопка відкриття dropdown */}
            <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 transition"
            >
        <span className="inline-flex h-5 w-5 overflow-hidden rounded-full ring-1 ring-slate-200">
          <Image
              src={CURRENCY_META[value].flag}
              alt=""
              width={20}
              height={20}
              className="h-5 w-5 object-cover"
          />
        </span>
                <span className="tabular-nums">{CURRENCY_META[value].symbol}</span>
                <span className="font-medium">{value}</span>
                <svg
                    viewBox="0 0 20 20"
                    className={`h-4 w-4 opacity-70 transition-transform ${
                        open ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                >
                    <path
                        d="M5.5 7.5l4.5 5 4.5-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            {/* ✅ Dropdown список */}
            {open && (
                <ul
                    role="listbox"
                    className="absolute z-20 mt-2 min-w-[160px] overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200"
                >
                    {currencies.map(({ code, available }) => (
                        <li key={code} role="option" aria-selected={code === value}>
                            <button
                                type="button"
                                onClick={() => {
                                    if (!available) return;
                                    onChange(code);
                                    setOpen(false);
                                }}
                                disabled={!available}
                                className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm transition ${
                                    !available
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-slate-50"
                                } ${code === value ? "bg-indigo-50 text-indigo-800" : ""}`}
                            >
                <span className="inline-flex h-5 w-5 overflow-hidden rounded-full ring-1 ring-slate-200">
                  <Image
                      src={CURRENCY_META[code].flag}
                      alt=""
                      width={20}
                      height={20}
                      className="h-5 w-5 object-cover"
                  />
                </span>
                                <span className="tabular-nums">{CURRENCY_META[code].symbol}</span>
                                <span className="font-medium">{code}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}