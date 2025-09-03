type Point = { month: number; value: number };

type Props = {
    currency: string;
    currencySymbol: string;
    series: Point[];
    target?: number;
};

import { currencyFormat } from "@/lib/format";
import { useMemo } from "react";

export default function JourneyChart({ series, target, currency }: Props) {
    const width = 900;
    const height = 320;
    const padding = { left: 56, right: 20, top: 20, bottom: 28 };

    const maxY = useMemo(() => {
        const maxSeries = Math.max(...series.map((p) => p.value), target ?? 0);
        const pow = Math.pow(10, Math.floor(Math.log10(maxSeries || 1)));
        const top = Math.ceil(maxSeries / pow) * pow;
        return top || 1;
    }, [series, target]);

    const path = useMemo(() => {
        const w = width - padding.left - padding.right;
        const h = height - padding.top - padding.bottom;
        const maxX = Math.max(...series.map((p) => p.month), 1);
        const toX = (m: number) => padding.left + (m / maxX) * w;
        const toY = (v: number) => padding.top + h - (v / maxY) * h;
        return series.map((p, i) => `${i === 0 ? "M" : "L"} ${toX(p.month)} ${toY(p.value)}`).join(" ");
    }, [series, maxY, padding.left, padding.right, padding.top, padding.bottom]);

    const yTicks = useMemo(() => {
        const ticks = 4;
        return new Array(ticks + 1).fill(0).map((_, i) => (maxY / ticks) * i);
    }, [maxY]);

    return (
        <div className="w-full overflow-x-auto">
            <svg width={width} height={height} className="w-full">
                <rect x="0" y="0" width={width} height={height} className="fill-background-surface" />
                {yTicks.map((v, i) => {
                    const y = height - 28 - ((v / maxY) * (height - 48));
                    return <line key={i} x1={56} x2={width - 20} y1={y} y2={y} className="stroke-border-tertiary" strokeWidth="1" />;
                })}
                <path d={path} className="stroke-content-interactive-tertiary fill-none" strokeWidth="2" />
                {typeof target === "number" && Number.isFinite(target) ? (
                    <>
                        <line
                            x1={56}
                            x2={width - 20}
                            y1={height - 28 - ((target / maxY) * (height - 48))}
                            y2={height - 28 - ((target / maxY) * (height - 48))}
                            className="stroke-content-interactive-secondary"
                            strokeDasharray="6 6"
                            strokeWidth="2"
                        />
                        <text x={width - 22} y={height - 32 - ((target / maxY) * (height - 48))} textAnchor="end" className="fill-content text-body-small">
                            Target
                        </text>
                    </>
                ) : null}
                {yTicks.map((v, i) => {
                    const y = height - 28 - ((v / maxY) * (height - 48));
                    return (
                        <text key={i} x={50} y={y + 4} textAnchor="end" className="fill-content-secondary text-caption-small">
                            {currencyFormat(v, currency as any)}
                        </text>
                    );
                })}
                <text x={padding.left} y={height - 6} className="fill-content-secondary text-caption-small">Time (months)</text>
            </svg>
        </div>
    );
}
