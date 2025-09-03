type Props = {
    label: string;
    value: number;
    onChange: (v: number) => void;
    min?: number;
    max?: number;
    step?: number;
    suffix?: string;
};

export default function Slider({ label, value, onChange, min = 0, max = 100, step = 1, suffix }: Props) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
                <div className="text-body-medium text-content-secondary">{label}</div>
                <div className="text-body-medium text-content">{value}{suffix}</div>
            </div>
            <input
                type="range"
                className="w-full"
                value={value}
                min={min}
                max={max}
                step={step}
                onChange={(e) => onChange(Number(e.target.value))}
            />
        </div>
    );
}
