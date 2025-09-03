type Row = { month: number; dividend: number; spending: number };

type Props = {
    currency: string;
    currencySymbol: string;
    series: Row[];
};

import { currencyFormat } from "@/lib/format";
import { useMemo } from "react";

export default function DividendInflationChart({ series, currency }: Props) {
    const width = 900;
    const height = 320;
    const padding = { left: 56, right: 20, top: 20, bottom: 28 };

    const maxY = useMemo(() => {
        const maxSeries = Math.max(...series.map((p) => Math.max(p.dividend, p.spending)));
        const pow = Math.pow(10, Math.floor(Math.log10(maxSeries || 1)));
        const top = Math.ceil(maxSeries / pow) * pow;
        return top || 1;
    }, [series]);

    const line = (picker: (r: Row) => number) => {
        const w = width - padding.left - padding.right;
        const h = height - padding.top - padding.bottom;
        const maxX = Math.max(...series.map((p) => p.month), 1);
        const toX = (m: number) => padding.left + (m / maxX) * w;
        const toY = (v: number) => padding.top + h - (v / maxY) * h;
        return series.map((p, i) => `${i === 0 ? "M" : "L"} ${toX(p.month)} ${toY(picker(p))}`).join(" ");
    };

    const yTicks = useMemo(() => {
        const ticks = 4;
        return new Array(ticks + 1).fill(0).map((_, i) => (maxY / ticks) * i);
    }, [maxY]);

    return (
        <div className="w-full overflow-x-auto">
            <div className="flex items-center gap-3">
                <h3 className="text-title-medium text-content">Dividends vs inflation-adjusted spending</h3>
            </div>
            <svg width={width} height={height} className="w-full">
                <rect x="0" y="0" width={width} height={height} className="fill-background-surface" />
                {yTicks.map((v, i) => {
                    const y = height - 28 - ((v / maxY) * (height - 48));
                    return <line key={i} x1={56} x2={width - 20} y1={y} y2={y} className="stroke-border-tertiary" strokeWidth="1" />;
                })}
                <path d={line((r) => r.dividend)} className="stroke-content-interactive-primary fill-none" strokeWidth="2" />
                <path d={line((r) => r.spending)} className="stroke-content-interactive-secondary fill-none" strokeWidth="2" strokeDasharray="4 4" />
                {yTicks.map((v, i) => {
                    const y = height - 28 - ((v / maxY) * (height - 48));
                    return (
                        <text key={i} x={50} y={y + 4} textAnchor="end" className="fill-content-secondary text-caption-small">
                            {currencyFormat(v, currency as any)}
                        </text>
                    );
                })}
                <text x={padding.left} y={height - 6} className="fill-content-secondary text-caption-small">Time (months)</text>
                <g transform="translate(70,20)">
                    <rect width="12" height="2" className="fill-content-interactive-primary" y="0" />
                    <text x="18" y="4" className="fill-content-secondary text-caption-small">Dividends</text>
                </g>
                <g transform="translate(170,20)">
                    <rect width="12" height="2" className="fill-content-interactive-secondary" y="0" />
                    <text x="18" y="4" className="fill-content-secondary text-caption-small">Spending (inflation-adjusted)</text>
                </g>
            </svg>
        </div>
    );
}
