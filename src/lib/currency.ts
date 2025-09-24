export type Currency = "EUR" | "USD" | "GBP";

export const CURRENCY_META: Record<
    Currency,
    {
        label: string;
        symbol: string;
        flag: string;
        fixedPresets: Array<{ key: string; label: string; rate: number }>;
    }
> = {
    EUR: {
        label: "Euro",
        symbol: "€",
        flag: "/flags/eu.png",
        fixedPresets: [{key: "lightyear", label: "Lightyear Savings", rate: 2.01}],
    },
    USD: {
        label: "US Dollar",
        symbol: "$",
        flag: "/flags/us.png",
        fixedPresets: [{key: "lightyear", label: "Lightyear Savings", rate: 4.32}],
    },
    GBP: {
        label: "British Pound",
        symbol: "£",
        flag: "/flags/uk.png",
        fixedPresets: [{key: "lightyear", label: "Lightyear Savings", rate: 4.15}],
    }
};
