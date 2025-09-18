// "use client";
//
// import * as React from "react";
// import * as Slider from "@radix-ui/react-slider";
//
// type SliderFieldProps = {
//     label: string;
//     value: number;
//     onChange: (v: number) => void;
//     min?: number;
//     max?: number;
//     step?: number;
//     suffix?: string; // например: "%"
//     disabled?: boolean;
// };
//
// export function SliderField({
//                                 label,
//                                 value,
//                                 onChange,
//                                 min = 0,
//                                 max = 100,
//                                 step = 1,
//                                 suffix = "%",
//                                 disabled = false,
//                             }: SliderFieldProps) {
//     return (
//         <div className="w-full">
//             <div className="mb-1 flex items-center justify-between">
//                 <span className="text-sm text-muted-foreground">{label}</span>
//                 <span className="text-sm font-medium tabular-nums">
//           {Math.round(value)}{suffix}
//         </span>
//             </div>
//
//             <Slider.Root
//                 className="relative flex h-10 w-full touch-none select-none items-center"
//                 min={min}
//                 max={max}
//                 step={step}
//                 value={[value]}
//                 disabled={disabled}
//                 onValueChange={(vals) => onChange(vals[0] ?? value)}
//                 // центрируем палец как в твоём примере
//                 style={{ ["--radix-slider-thumb-transform" as any]: "translateX(-50%)" }}
//             >
//                 <Slider.Track className="relative h-1 w-full flex-grow rounded bg-slate-200 dark:bg-zinc-700">
//                     <Slider.Range className="absolute h-full rounded bg-blue-600" />
//                 </Slider.Track>
//
//                 <Slider.Thumb
//                     className="block size-5 rounded-full bg-blue-600 outline-none ring-0 hover:bg-blue-600/90 active:scale-95"
//                     aria-label={label}
//                     style={{ transform: "var(--radix-slider-thumb-transform)" }}
//                 />
//             </Slider.Root>
//         </div>
//     );
// }
