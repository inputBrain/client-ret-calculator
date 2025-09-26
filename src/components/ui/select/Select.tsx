// "use client";
// import * as Select from "@radix-ui/react-select";
// import { ChevronDownIcon } from "@radix-ui/react-icons";
// import React from "react";
//
// export type SelectOption = { value: string; label: string };
//
// export function SelectBox({
//     value,
//     onValueChange,
//     options,
//     placeholder,
//     className,
//     minWidth = 220,
// }: {
//     value: string;
//     onValueChange: (v: string) => void;
//     options: SelectOption[];
//     placeholder?: string;
//     className?: string;
//     minWidth?: number;
// }) {
//     return (
//         <Select.Root value={value} onValueChange={onValueChange}>
//             <Select.Trigger
//                 className={`inline-flex h-11 items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-[15px] text-slate-800 shadow-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 ${className ?? ""}`}
//                 aria-label="Select option"
//                 style={{ minWidth }}
//             >
//                 <Select.Value placeholder={placeholder} />
//                 <Select.Icon>
//                     <ChevronDownIcon />
//                 </Select.Icon>
//             </Select.Trigger>
//
//             <Select.Portal>
//                 <Select.Content
//                     className="z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
//                     position="popper"
//                     sideOffset={8}
//                 >
//                     <Select.Viewport className="min-w-[220px] p-1">
//                         {options.map((o, i) => (
//                             <Select.Item
//                                 key={`${o.value}-${i}`}
//                                 value={o.value}
//                                 className="group relative flex cursor-pointer select-none items-center justify-between rounded-xl px-4 py-3 text-[15px] text-slate-800 outline-none data-[highlighted]:bg-indigo-50"
//                             >
//                                 <Select.ItemText>{o.label}</Select.ItemText>
//                                 <Select.ItemIndicator>
//                                       <span className="ml-4 inline-flex h-5 w-5 items-center justify-center rounded-full border border-indigo-200">
//                                         <span className="h-3 w-3 rounded-full bg-indigo-600" />
//                                       </span>
//                                 </Select.ItemIndicator>
//                             </Select.Item>
//                         ))}
//                     </Select.Viewport>
//                 </Select.Content>
//             </Select.Portal>
//         </Select.Root>
//     );
// }
// export default SelectBox;
