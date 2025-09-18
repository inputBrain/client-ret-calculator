// type Option = { value: string; label: string };
//
// type Props = {
//     options: Option[];
//     value: string;
//     onChange: (v: string) => void;
// };
//
// export default function ToggleGroup({ options, value, onChange }: Props) {
//     return (
//         <div className="flex items-center gap-2">
//             {options.map((o) => (
//                 <button
//                     key={o.value}
//                     type="button"
//                     onClick={() => onChange(o.value)}
//                     className={`h-10 px-4 rounded-full text-title-small transition duration-fast ease-curve ${value === o.value
//                         ? "bg-[rgb(var(--background-interactive-primary-normal))] text-content-inverse"
//                         : "bg-[rgb(var(--background-interactive-tertiary-normal))] text-content-interactive-tertiary"
//                     }`}
//                 >
//                     {o.label}
//                 </button>
//             ))}
//         </div>
//     );
// }
