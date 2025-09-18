// type Props = {
//     currency: string;
//     currencySymbol: string;
//     target: number;
//     retirementAge: number;
//     annualSavings: number;
// };
//
// import { currencyFormat } from "@/lib/format";
//
// export default function ResultsHeader({ currency, target, retirementAge, annualSavings }: Props) {
//     const targetStr = Number.isFinite(target) ? currencyFormat(target, currency as any) : "—";
//     const ageStr = Number.isFinite(retirementAge) ? Math.round(retirementAge).toString() : "—";
//     const annualSavingsStr = currencyFormat(annualSavings, currency as any);
//
//     return (
//         <div className="relative flex min-h-[150px] flex-col gap-12 rounded-2xl bg-gradient-to-b from-background-surface from-45% to-background-surface/0 px-16 py-12 max-tablet:-mx-3 max-tablet:gap-4 max-tablet:px-4 max-tablet:py-6">
//             <div className="flex justify-between">
//                 <div className="flex flex-col items-center text-center">
//                     <h5 className="text-headline-small text-content">{targetStr}</h5>
//                     <span className="flex items-center gap-1">
//             <span className="text-body-medium text-content-secondary">Your FIRE target</span>
//           </span>
//                 </div>
//                 <div className="flex flex-col items-center text-center">
//                     <h3 className="text-headline-large max-mobile:text-headline-medium text-content">{ageStr}</h3>
//                     <span className="flex items-center gap-1">
//             <span className="text-body-medium text-content-secondary">Retirement age</span>
//           </span>
//                 </div>
//                 <div className="flex flex-col items-center text-center">
//                     <h5 className="text-headline-small text-content">{annualSavingsStr}</h5>
//                     <span className="flex items-center gap-1">
//             <span className="text-body-medium text-content-secondary">Annual savings</span>
//           </span>
//                 </div>
//             </div>
//         </div>
//     );
// }
