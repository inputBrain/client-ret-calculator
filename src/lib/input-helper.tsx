import * as React from "react";
import * as Slider from "@radix-ui/react-slider";
import * as Tooltip from "@radix-ui/react-tooltip";

import * as Select from "@radix-ui/react-select";
import {ChevronDownIcon} from "@radix-ui/react-icons";
import clsx from "clsx";


export function Row({label, value, onChange}: { label: string; value: number; onChange: (v: number) => void }) {
    return (
        <div
            className="-mx-3 flex min-h-12 items-center justify-between gap-1 rounded bg-background-interactive-tertiary px-3 py-2 [&_>_*:first-child]:flex-[1_1_30%] [&_>_*:nth-child(2)]:flex-[1_1_70%]">
            <div className="mb-2 flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600 ">{label}</span>
                <span className="text-sm font-semibold tabular-nums text-gray-900">{Math.round(value)}%</span>
            </div>
            <Slider.Root
                className="relative flex h-10 w-full touch-none select-none items-center"
                min={0}
                max={100}
                step={1}
                value={[value]}
                onValueChange={(vals) => onChange(vals[0] ?? value)}
                style={{["--radix-slider-thumb-transform" as any]: "translateX(-50%)"}}
            >
                <Track/>
                <Thumb label={label}/>
            </Slider.Root>
        </div>
    );
}


export function Track() {
    return (
        <Slider.Track className="relative h-1.5 w-full flex-grow rounded-full bg-gray-200">
            <Slider.Range className="absolute h-full rounded-full bg-indigo-500"/>
        </Slider.Track>
    );
}

export function Thumb({label}: { label: string }) {
    return (
        <Slider.Thumb
            aria-label={label}
            className="block h-5 w-5 rounded-full bg-indigo-600 shadow outline-none
               focus-visible:ring-4 focus-visible:ring-indigo-300
               data-[state=active]:scale-95"
        />
    );
}

export function PercentInput({value, onChange}: { value: number; onChange: (n: number) => void }) {
    return (
        <div
            className="flex h-11 w-24 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-[15px] text-slate-900 shadow-sm focus-within:ring-2 focus-within:ring-indigo-400">
            <input
                type="number"
                step="1"
                min={0}
                max={5000}
                value={Number.isFinite(value) ? value : 0}
                onChange={(e) => {
                    const raw = parseFloat(e.target.value || "0");
                    const clamped = Math.min(Math.max(raw, 0), 5000); // от 0 до 500
                    onChange(clamped);
                }}
                className="w-full bg-transparent text-center outline-none"
            />
            <span className="pl-1 text-slate-500">%</span>
        </div>
    );
}


export function Info({tooltip}: { tooltip: string }) {
    return (
        <Tooltip.Provider delayDuration={200}>
            <Tooltip.Root>
                <Tooltip.Trigger
                    className="ml-2 inline-flex size-4 items-center justify-center rounded-full bg-indigo-600 text-white text-lg "
                    aria-label="Info"
                >
                    i
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content
                        className="max-w-xs rounded-xl bg-slate-800 px-3 py-2 text-sm text-white shadow-xl"
                        side="top"
                        sideOffset={8}
                    >
                        {tooltip}
                        <Tooltip.Arrow className="fill-slate-900"/>
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
}


export function SelectBox({
    value,
    onValueChange,
    options,
    placeholder,
}: {
    value: string;
    onValueChange: (v: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
}) {
    return (
        <Select.Root value={value} onValueChange={onValueChange}>
            <Select.Trigger
                className="inline-flex h-11 min-w-[220px] items-center justify-between  rounded-xl border border-slate-200 bg-white px-4 text-[15px] text-slate-800 shadow-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
                aria-label="Select option"
            >
                <Select.Value placeholder={placeholder}/>
                <Select.Icon>
                    <ChevronDownIcon/>
                </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
                <Select.Content
                    className="z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
                    position="popper"
                    sideOffset={8}
                >
                    <Select.Viewport className="min-w-[220px] p-1">
                        {options.map((o, i) => (
                            <Select.Item
                                key={`${o.value}-${i}`}
                                value={o.value}
                                className="group relative flex cursor-pointer select-none items-center justify-between rounded-xl px-4 py-3 text-[15px] text-slate-800 outline-none data-[highlighted]:bg-indigo-50"
                            >
                                <Select.ItemText>{o.label}</Select.ItemText>
                                <Select.ItemIndicator>
                  <span
                      className="ml-4 inline-flex h-5 w-5 items-center justify-center rounded-full border border-indigo-200">
                    <span className="h-3 w-3 rounded-full bg-indigo-600"/>
                  </span>
                                </Select.ItemIndicator>
                            </Select.Item>
                        ))}
                    </Select.Viewport>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    );
}


function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

export default function PercentInputLikeInInflation({
    value,
    onChange,
    min = 0,
    max = 20000,
    step = 1,
    placeholder = "0.00",
    className = "",
}: {
    value: number;
    onChange: (n: number) => void;
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
    className?: string;
}) {
    return (
        <div
            className={clsx(
                "relative h-11 w-32 rounded-xl border border-slate-200 bg-white shadow-sm",
                "focus-within:ring-2 focus-within:ring-indigo-400",
                className
            )}
        >
            <input
                type="number"
                inputMode="decimal"
                step={step}
                min={min}
                max={max}
                value={Number.isFinite(value) ? value : 0}
                onChange={(e) => {
                    const raw = e.target.value;
                    const n = parseFloat(raw);
                    if (!Number.isFinite(n)) {
                        onChange(min);
                        return;
                    }
                    onChange(clamp(n, min, max));
                }}
                onBlur={(e) => {
                    const n = parseFloat(e.target.value);
                    if (Number.isFinite(n)) onChange(clamp(n, min, max));
                }}
                onWheel={(e) => {
                    (e.target as HTMLInputElement).blur();
                }}
                placeholder={placeholder}
                className={clsx(
                    "w-full h-full bg-transparent outline-none",
                    "px-4 pr-7 text-[15px] text-slate-900"
                )}
                aria-label="Percent"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
        %
      </span>
        </div>
    );
}
