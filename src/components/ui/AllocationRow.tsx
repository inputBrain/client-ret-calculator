"use client";

import * as Slider from "@radix-ui/react-slider";

type AllocationRowProps = {
    label: string;
    value: number;
    onChange: (v: number) => void;
    min?: number;
    max?: number;
    step?: number;
};

export function AllocationRow({
                                  label,
                                  value,
                                  onChange,
                                  min = 0,
                                  max = 100,
                                  step = 1,
                              }: AllocationRowProps) {
    return (
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-base font-semibold text-gray-800">{label}</h3>

            <div className="mb-2 flex items-center gap-3">
                <span className="text-sm text-gray-600 font-semibold">Allocation:</span>
                <span className="text-sm font-semibold tabular-nums text-gray-900">
          {Math.round(value)} %
        </span>
            </div>

            <Slider.Root
                className="relative flex h-10 w-full touch-none select-none items-center"
                min={min}
                max={max}
                step={step}
                value={[value]}
                onValueChange={(vals) => onChange(vals[0] ?? value)}
                // центрируем «пальчик» как в исходном примере
                style={{["--radix-slider-thumb-transform" as any]: "translateX(-50%)"}}
            >
                {/* незаполненная часть — серая */}
                <Slider.Track className="relative h-1 w-full flex-grow rounded-full bg-gray-200">
                    {/* заполненная часть — фиолетовая */}
                    <Slider.Range className="absolute h-full rounded-full bg-purple-600"/>
                </Slider.Track>

                {/* сам ползунок — фиолетовый кружок */}
                <Slider.Thumb
                    aria-label={`${label} value`}
                    className="h-6 w-6 rounded-full bg-purple-600 shadow-md outline-none transition
                     hover:bg-purple-700 active:scale-95
                     focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                    style={{transform: "var(--radix-slider-thumb-transform)"}}
                />
            </Slider.Root>

            {/* мелкий дисклеймер, как на скрине */}
            {/* <p className="mt-3 text-xs leading-5 text-gray-500">
        Returns may vary…
      </p> */}
        </div>
    );
}
