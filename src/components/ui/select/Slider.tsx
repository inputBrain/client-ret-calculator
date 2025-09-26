// "use client";
// import * as RadixSlider from "@radix-ui/react-slider";
// import React from "react";
//
// export function Slider({
//                            value,
//                            onChange,
//                            ariaLabel,
//                        }: {
//     value: number;
//     onChange: (n: number) => void;
//     ariaLabel?: string;
// }) {
//     return (
//         <RadixSlider.Root
//             className="relative flex h-10 w-full touch-none select-none items-center"
//             min={0}
//             max={100}
//             step={1}
//             value={[value]}
//             onValueChange={(vals) => onChange(vals[0] ?? value)}
//             style={{ ["--radix-slider-thumb-transform" as any]: "translateX(-50%)" }}
//             aria-label={ariaLabel}
//         >
//             <RadixSlider.Track className="relative h-1 w-full flex-grow rounded-full bg-gray-200">
//                 <RadixSlider.Range className="absolute h-full rounded-full bg-indigo-500" />
//             </RadixSlider.Track>
//             <RadixSlider.Thumb
//                 className="relative h-2 w-2 rounded-full bg-indigo-600 shadow-lg ring-6 ring-indigo-500 hover:bg-indigo-700 active:scale-95 focus-visible:ring-6 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
//                 style={{ transform: "translateX(-50%)" }}
//             />
//         </RadixSlider.Root>
//     );
// }
// export default Slider;
