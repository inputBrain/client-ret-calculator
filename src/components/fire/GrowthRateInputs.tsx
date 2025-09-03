import NumberField from "./NumberField";

type Props = {
    stocksRate: number;
    fixedRate: number;
    cashRate: number;
    onChange: (v: { stocksRate: number; fixedRate: number; cashRate: number }) => void;
};

export default function GrowthRateInputs({ stocksRate, fixedRate, cashRate, onChange }: Props) {
    return (
        <div className="grid grid-cols-1 gap-4 tablet:grid-cols-3 max-tablet:grid-cols-1">
            <div className="-mx-3 flex min-h-12 items-center justify-between gap-1 rounded bg-background-interactive-tertiary px-3 py-2">
                <span className="text-body-medium text-content-secondary">Stocks growth</span>
                <div className="w-40">
                    <NumberField label="" value={stocksRate} onChange={(v) => onChange({ stocksRate: v, fixedRate, cashRate })} min={0} max={20} step={0.1} suffix="% p/a" />
                </div>
            </div>
            <div className="-mx-3 flex min-h-12 items-center justify-between gap-1 rounded bg-background-interactive-tertiary px-3 py-2">
                <span className="text-body-medium text-content-secondary">Fixed interest growth</span>
                <div className="w-40">
                    <NumberField label="" value={fixedRate} onChange={(v) => onChange({ stocksRate, fixedRate: v, cashRate })} min={0} max={20} step={0.1} suffix="% p/a" />
                </div>
            </div>
            <div className="-mx-3 flex min-h-12 items-center justify-between gap-1 rounded bg-background-interactive-tertiary px-3 py-2">
                <span className="text-body-medium text-content-secondary">Cash growth</span>
                <div className="w-40">
                    <NumberField label="" value={cashRate} onChange={(v) => onChange({ stocksRate, fixedRate, cashRate: v })} min={0} max={20} step={0.1} suffix="% p/a" />
                </div>
            </div>
        </div>
    );
}
