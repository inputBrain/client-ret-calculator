// CurrencyDropdown.tsx
import * as React from "react";
import Image from "next/image";
import {type Currency, CURRENCY_META, isCurrency} from "@/lib/currency"; // ваши экспортированные утилы

type Option = {
    code: Currency;
    available?: boolean; // можно отключать (например, если нет monoLinks[code])
};

type Props = {
    value: Currency;
    onChange: (ccy: Currency) => void;
    options?: Option[];   // по умолчанию: ["UAH","EUR","USD"]
    ariaLabel?: string;
    className?: string;
};

export function CurrencyDropdown({
    value,
    onChange,
    availableMap,
    className = "",
}: {
    value: Currency;
    onChange: (c: Currency) => void;
    availableMap?: Partial<Record<Currency, string | boolean>>;
    className?: string;
}) {
    const [open, setOpen] = React.useState(false);
    const btnRef = React.useRef<HTMLButtonElement | null>(null);

    React.useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (!btnRef.current) return;
            if (!btnRef.current.parentElement?.contains(e.target as Node)) setOpen(false);
        };
        if (open) document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, [open]);

    const codes = ["UAH", "EUR", "USD"] as const;

    return (
        <div className={`relative ${className}`}>
            <button
                ref={btnRef}
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((s) => !s)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200"
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
                <svg viewBox="0 0 20 20" className="h-4 w-4 opacity-70" aria-hidden="true">
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

            {open && (
                <ul
                    role="listbox"
                    tabIndex={-1}
                    className="absolute z-20 mt-2 min-w-[160px] overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg"
                >
                    {(["UAH","EUR","USD"] as const).map((code) => {
                        const available = availableMap ? !!availableMap[code] : true;
                        const disabled = !available;
                        return (
                            <li key={code} role="option" aria-selected={code === value}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (disabled) return;
                                        onChange(code);
                                        setOpen(false);
                                    }}
                                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm transition
                    ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50"}
                    ${code === value ? "bg-indigo-50" : ""}
                  `}
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
                        );
                    })}
                </ul>
            )}
        </div>
    );
}