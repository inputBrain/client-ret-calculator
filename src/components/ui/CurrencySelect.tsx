// src/components/ui/CurrencySelect.tsx
"use client";

import * as Select from "@radix-ui/react-select";
import {ChevronDownIcon} from "@radix-ui/react-icons";
import Image from "next/image";
import {CURRENCY_META, type Currency} from "@/lib/currency";

export default function CurrencySelect({
    value,
    onValueChangeAction,
    side = "bottom",
    align = "end",
}: {
    value: Currency;
    onValueChangeAction: (v: Currency) => void;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
}) {
    return (
        <Select.Root value={value} onValueChange={(v) => onValueChangeAction(v as Currency)}>
            <Select.Trigger className="inline-flex h-8 items-center gap-2 rounded-full px-3 text-sm text-indigo-700 hover:text-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200"
                aria-label="Currency"
            >
                {/* кастомное Value: флаг + лейбл */}
                <span className="inline-flex items-center gap-2">
          <Image
              src={CURRENCY_META[value].flag}
              alt=""
              width={24}
              height={24}
              className="rounded-full ring-1 ring-slate-200"
          />
          <span className="text-indigo-600 text-sm font-semibold">{CURRENCY_META[value].label}</span>
        </span>
                <Select.Icon>
                    <ChevronDownIcon className="size-4"/>
                </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
                <Select.Content
                    position="popper"
                    side={side}
                    align={align}
                    sideOffset={8}
                    className="z-50 rounded-2xl border border-slate-200 bg-white shadow-2xl min-w-[300px] overflow-hidden"
                >
                    <Select.Viewport className="min-w-[240px] p-2">
                        {(Object.keys(CURRENCY_META) as Currency[]).map((code) => {
                            const m = CURRENCY_META[code];
                            return (
                                <Select.Item
                                    key={code}
                                    value={code}
                                    className="group relative flex cursor-pointer select-none items-center rounded-xl px-3 py-2 text-[15px] text-slate-900 outline-none data-[highlighted]:bg-indigo-50"
                                >
                                    {/* слева флаг */}
                                    <span
                                        className="mr-3 inline-flex h-5 w-5 overflow-hidden rounded-full ring-1 ring-slate-200">
                    <Image src={m.flag} alt="" width={24} height={24} className="h-5 w-5 object-cover"/>
                  </span>
                                    {/* центр — название */}
                                    <Select.ItemText>{m.label}</Select.ItemText>
                                    {/* справа — кружок с «пулей» у выбранного */}
                                    <span
                                        className="ml-auto inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 group-data-[state=checked]:border-indigo-600"
                                        aria-hidden
                                    >
                    <Select.ItemIndicator>
                      <span className="h-3 w-3 rounded-full bg-indigo-600"/>
                    </Select.ItemIndicator>
                  </span>
                                </Select.Item>
                            );
                        })}
                    </Select.Viewport>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    );
}
