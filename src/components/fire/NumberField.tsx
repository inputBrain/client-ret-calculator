import { useMemo, useState } from "react";

type Props = {
    label: string;
    value: number;
    onChange: (v: number) => void;
    min?: number;
    max?: number;
    step?: number;
    suffix?: string;
    format?: (v: number) => string;
    parse?: (s: string) => number;
};

export default function NumberField({ label, value, onChange, min, max, step, suffix, format, parse }: Props) {
    const [text, setText] = useState<string>("");

    const display = useMemo(() => {
        if (text.length) return text;
        if (format) return format(value);
        return String(value);
    }, [text, value, format]);

    return (
        <label className="flex flex-col gap-2">
            <span className="text-body-medium text-content-secondary">{label}</span>
            <div className="flex items-center gap-2 rounded bg-background-interactive-tertiary px-3 py-2">
                <input
                    className="w-full bg-transparent outline-none text-title-small text-content"
                    inputMode="decimal"
                    value={display}
                    onChange={(e) => {
                        const s = e.target.value;
                        setText(s);
                        const parsed = parse ? parse(s) : Number(s);
                        if (!Number.isNaN(parsed)) onChange(parsed);
                    }}
                    onBlur={() => setText("")}
                />
                {suffix ? <span className="text-body-medium text-content-secondary">{suffix}</span> : null}
            </div>
            <input
                type="range"
                className="w-full"
                value={value}
                min={min ?? 0}
                max={max ?? 1000000}
                step={step ?? 1}
                onChange={(e) => onChange(Number(e.target.value))}
            />
        </label>
    );
}
