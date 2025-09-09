"use client";

import * as React from "react";
import * as Slider from "@radix-ui/react-slider";

type Props = {
    value: number;
    onChange: (v: number) => void;
    min?: number;
    max?: number;
    step?: number;
};

export function ValueSlider({
                                value,
                                onChange,
                                min = 0,
                                max = 100,
                                step = 1,
                            }: Props) {
    return (
        <div className="w-full">
            <Slider.Root
                className="relative flex h-14 w-full touch-none select-none items-center"
                min={min}
                max={max}
                step={step}
                value={[value]}
                onValueChange={(vals) => onChange(vals[0] ?? value)}
                // переменная для центрирования «пальца», как в твоём примере
                style={{["--radix-slider-thumb-transform" as any]: "translateX(-50%)"}}
            >
                {/* Трек */}
                <Slider.Track className="relative h-1 flex-grow bg-background-neutral rounded">
                    {/* Заполненная часть */}
                    <Slider.Range className="absolute h-full bg-background-interactive-primary rounded"/>
                </Slider.Track>

                {/* Ползунок */}
                <Slider.Thumb
                    className="block size-8 rounded-full bg-background-interactive-primary hover:bg-background-interactive-primary-hoverPress focus:outline-none active:bg-background-interactive-primary-active"
                    aria-label="Value"
                    // Radix сам ставит transform, но если хочешь — можно принудительно:
                    style={{transform: "var(--radix-slider-thumb-transform)"}}
                />
            </Slider.Root>

            <div className="mt-2 text-sm text-muted-foreground">
                Value: <span className="font-medium">{value}</span>
            </div>
        </div>
    );
}
