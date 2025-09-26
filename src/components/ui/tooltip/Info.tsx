// "use client"
//
// import * as Tooltip from "@radix-ui/react-tooltip";
// import * as React from "react";
//
// function Info({tooltip}: { tooltip: string }) {
//     return (
//         <Tooltip.Provider delayDuration={200}>
//             <Tooltip.Root>
//                 <Tooltip.Trigger
//                     className="ml-2 inline-flex size-4 items-center justify-center rounded-full bg-indigo-600 text-white text-lg "
//                     aria-label="Info"
//                 >
//                     i
//                 </Tooltip.Trigger>
//                 <Tooltip.Portal>
//                     <Tooltip.Content
//                         className="max-w-xs rounded-xl bg-slate-800 px-3 py-2 text-sm text-white shadow-xl"
//                         side="top"
//                         sideOffset={8}
//                     >
//                         {tooltip}
//                         <Tooltip.Arrow className="fill-slate-900"/>
//                     </Tooltip.Content>
//                 </Tooltip.Portal>
//             </Tooltip.Root>
//         </Tooltip.Provider>
//     );
// }
//
// // export default React.memo(Info);
// export default Info;