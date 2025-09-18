// "use client";
//
// import * as React from "react";
// import {SliderField} from "@/components/ui/SliderField";
//
// function clamp(n: number, min: number, max: number) {
//     return Math.min(max, Math.max(min, n));
// }
//
// type Props = {
//     stocksPct: number;
//     fixedPct: number;
//     // cash считается как 100 - stocks - fixed
//     setStocksPct: (n: number) => void;
//     setFixedPct: (n: number) => void;
// };
//
// export default function AllocationSliders({
//     stocksPct,
//     fixedPct,
//     setStocksPct,
//     setFixedPct,
// }: Props) {
//     const cashPct = React.useMemo(
//         () => Math.max(0, 100 - stocksPct - fixedPct),
//         [stocksPct, fixedPct]
//     );
//
//     const handleStocks = (next: number) => {
//         next = clamp(next, 0, 100);
//         const remain = 100 - next;
//         if (fixedPct > remain) {
//             setFixedPct(remain);
//         }
//         setStocksPct(next);
//     };
//
//     const handleFixed = (next: number) => {
//         next = clamp(next, 0, 100);
//         const remain = 100 - stocksPct;
//         if (next > remain) {
//             next = remain;
//         }
//         setFixedPct(next);
//     };
//
//     return (
//         <div className="grid gap-4 rounded-2xl border p-4 shadow-sm">
//             <div className="text-sm font-medium">Allocation</div>
//             <SliderField label="Stocks" value={stocksPct} onChange={handleStocks}/>
//             <SliderField label="Fixed income" value={fixedPct} onChange={handleFixed}/>
//             <div className="flex items-center justify-between">
//                 <span className="text-sm text-muted-foreground">Cash</span>
//                 <span className="text-sm font-medium tabular-nums">{Math.round(cashPct)}%</span>
//             </div>
//             <div className="text-xs text-muted-foreground">
//                 Total: <span className="tabular-nums">{Math.round(stocksPct + fixedPct + cashPct)}%</span>
//             </div>
//         </div>
//     );
// }
