import React, { useMemo } from "react";
import {
    SiBitcoin,
    SiPaypal,
    SiBuymeacoffee,
    SiThirdweb,
} from "react-icons/si";
import { Banknote } from "lucide-react";
import { type PaymentMethod } from "@/hooks/useDonationState";

interface PaymentMethodTabsProps {
    method: PaymentMethod;
    onMethodChange: (method: PaymentMethod) => void;
}

const iconCls = "h-4 w-4";

const TABS = [
    {
        key: "bmac" as const,
        label: "Buy Me a Coffee",
        icon: <SiBuymeacoffee className={iconCls} />,
    },
    {
        key: "paypal" as const,
        label: "PayPal",
        icon: <SiPaypal className={iconCls} />,
    },
    {
        key: "uah" as const,
        label: "Monobank",
        icon: <Banknote className={iconCls} />,
    },
    {
        key: "crypto" as const,
        label: "Crypto",
        icon: <SiThirdweb className={iconCls} />,
    },
] as const;

export function PaymentMethodTabs({ method, onMethodChange }: PaymentMethodTabsProps) {
    const activeIdx = useMemo(
        () => TABS.findIndex((t) => t.key === method),
        [method]
    );

    return (
        <div className="mb-6 relative grid grid-cols-4 rounded-2xl border border-gray-100 bg-white p-1 backdrop-blur shadow-[0_10px_30px_-1px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.04)] overflow-hidden">

            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-1 left-1 w-1/4 rounded-xl border border-indigo-200 bg-indigo-50 shadow-sm will-change-transform motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-reduce:transition-none"
                style={{ transform: `translateX(${activeIdx * 100}%)` }}
            />

            {/* ✅ Кнопки табів */}
            {TABS.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => onMethodChange(tab.key)}
                    className={`
            relative z-10 rounded-xl py-2 text-sm sm:text-base font-medium
            border border-transparent
            transition-[color,transform] duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200
            ${
                        method === tab.key
                            ? "text-indigo-800 scale-[1.02]"
                            : "text-slate-700 hover:text-slate-900"
                    }
          `}
                    aria-pressed={method === tab.key}
                >
          <span className="inline-flex items-center gap-2">
            {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
          </span>
                </button>
            ))}
        </div>
    );
}