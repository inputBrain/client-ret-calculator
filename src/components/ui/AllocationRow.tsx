"use client";

import * as Slider from "@radix-ui/react-slider";

type AllocationRowProps = {
    label: string;
    value: number;
    onChange: (v: number) => void;
};

export function AllocationRow({ label, value, onChange }: AllocationRowProps) {
    return (
        <div className="-mx-3 flex min-h-12 items-center justify-between gap-1 rounded bg-background-interactive-tertiary px-3 py-2">
            {/* Подпись */}
            <span className="flex-[0_0_15%] text-body-medium text-content-secondary">
        {label}:
      </span>

            {/* Текущее значение */}
            <div className="flex-[0_0_15%] text-center text-body-medium-bold text-content">
                {value}%
            </div>

            {/* Слайдер */}
            <Slider.Root
                className="relative flex h-14 w-full flex-[0_0_70%] touch-none select-none items-center"
                min={0}
                max={100}
                step={1}
                value={[value]}
                onValueChange={(vals) => onChange(vals[0] ?? value)}
                style={{ ["--radix-slider-thumb-transform" as any]: "translateX(-50%)" }}
            >
                {/* Track */}
                <Slider.Track className="relative h-1 w-full flex-grow bg-background-neutral rounded">
                    <Slider.Range className="absolute h-full bg-background-interactive-primary rounded" />
                </Slider.Track>

                {/* Thumb */}
                <Slider.Thumb
                    className="relative block size-8 rounded-full bg-background-interactive-primary hover:bg-background-interactive-primary-hoverPress focus:outline-none active:bg-background-interactive-primary-active"
                    aria-label={label}
                    style={{ transform: "var(--radix-slider-thumb-transform)" }}
                />
            </Slider.Root>
        </div>
    );
}
