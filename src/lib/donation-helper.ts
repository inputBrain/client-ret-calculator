export const preset = [100, 200, 500, 1000];

export const buyMeACoffee = (process.env.NEXT_PUBLIC_BMAC_URL as string) || "";
export const paypalDonateUrl = (process.env.NEXT_PUBLIC_PAYPAL_DONATE_URL as string) || "";
export const paypalMeUrl = (process.env.NEXT_PUBLIC_PAYPAL_ME_URL as string) || "";
export const paypalEmail = (process.env.NEXT_PUBLIC_PAYPAL_EMAIL as string) || "";
export const paypalCurrency = (process.env.NEXT_PUBLIC_PAYPAL_CURRENCY as string) || "USD";

export const monoLinks = {
    UAH: (process.env.NEXT_PUBLIC_MONOBANK_JAR_URL_UAH as string) || (process.env.NEXT_PUBLIC_MONOBANK_JAR_URL as string) || "",
    EUR: (process.env.NEXT_PUBLIC_MONOBANK_JAR_URL_EUR as string) || "",
    USD: (process.env.NEXT_PUBLIC_MONOBANK_JAR_URL_USD as string) || "",
} as const;


export const tokens: Array<{
    key: string;
    label: string;
    networks: Array<{ key: string; label: string; envKey: string }>;
}> = [
    {
        key: "btc",
        label: "Bitcoin (BTC)",
        networks: [
            {key: "bitcoin", label: "Bitcoin", envKey: "NEXT_PUBLIC_WALLET_BTC"},
        ],
    },
    {
        key: "eth",
        label: "Ethereum (ETH)",
        networks: [
            {
                key: "ethereum",
                label: "Ethereum",
                envKey: "NEXT_PUBLIC_WALLET_ETH",
            },
        ],
    },
    {
        key: "usdt",
        label: "Tether (USDT)",
        networks: [
            {
                key: "erc20",
                label: "ERC20 (Ethereum)",
                envKey: "NEXT_PUBLIC_WALLET_USDT_ETH",
            },
            {
                key: "trc20",
                label: "TRC20 (Tron)",
                envKey: "NEXT_PUBLIC_WALLET_USDT_TRON",
            },
        ],
    },
];
