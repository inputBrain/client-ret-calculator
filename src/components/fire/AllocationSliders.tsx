import Slider from "./Slider";

type Props = {
    stocksPct: number;
    fixedPct: number;
    onChange: (stocksPct: number, fixedPct: number) => void;
};

export default function AllocationSliders({ stocksPct, fixedPct, onChange }: Props) {
    const cashPct = Math.max(0, 100 - stocksPct - fixedPct);

    return (
        <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 gap-4 tablet:grid-cols-3 max-tablet:grid-cols-1">
                <div className="-mx-3 rounded bg-background-interactive-tertiary px-3 py-2">
                    <div className="text-body-medium text-content-secondary">Stocks</div>
                    <Slider label="Allocation" value={stocksPct} onChange={(v) => onChange(v, Math.min(fixedPct, 100 - v))} min={0} max={100 - fixedPct} suffix="%" />
                </div>
                <div className="-mx-3 rounded bg-background-interactive-tertiary px-3 py-2">
                    <div className="text-body-medium text-content-secondary">Fixed interest / savings</div>
                    <Slider label="Allocation" value={fixedPct} onChange={(v) => onChange(Math.min(stocksPct, 100 - v), v)} min={0} max={100 - stocksPct} suffix="%" />
                </div>
                <div className="-mx-3 rounded bg-background-interactive-tertiary px-3 py-2">
                    <div className="text-body-medium text-content-secondary">Cash</div>
                    <div className="text-title-small text-content">{cashPct}%</div>
                </div>
            </div>
        </div>
    );
}
