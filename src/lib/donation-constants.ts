import { type Currency, isCurrency } from "@/lib/currency";

export const ENV = {
    // Buy Me a Coffee
    bmacUrl: (process.env.NEXT_PUBLIC_BMAC_URL as string) || "",

    // PayPal
    paypalDonateUrl: (process.env.NEXT_PUBLIC_PAYPAL_DONATE_URL as string) || "",
    paypalMeUrl: (process.env.NEXT_PUBLIC_PAYPAL_ME_URL as string) || "",
    paypalEmail: (process.env.NEXT_PUBLIC_PAYPAL_EMAIL as string) || "",
    paypalCurrency: (process.env.NEXT_PUBLIC_PAYPAL_CURRENCY as string) || "USD",
    paypalDefaultCcy: ((process.env.NEXT_PUBLIC_PAYPAL_DEFAULT_CCY as string) || "USD").toUpperCase(),
    paypalAvailableCcys: ((process.env.NEXT_PUBLIC_PAYPAL_AVAILABLE_CCYS as string) || "USD").toUpperCase(),

    // Monobank
    monoUAH: (process.env.NEXT_PUBLIC_MONOBANK_JAR_URL_UAH as string) || (process.env.NEXT_PUBLIC_MONOBANK_JAR_URL as string) || "",
    monoEUR: (process.env.NEXT_PUBLIC_MONOBANK_JAR_URL_EUR as string) || "",
    monoUSD: (process.env.NEXT_PUBLIC_MONOBANK_JAR_URL_USD as string) || "",

    // Crypto wallets
    walletBTC: (process.env.NEXT_PUBLIC_WALLET_BTC as string) || "",
    walletETH: (process.env.NEXT_PUBLIC_WALLET_ETH as string) || "",
    walletUSDT_ETH: (process.env.NEXT_PUBLIC_WALLET_USDT_ETH as string) || "",
    walletUSDT_TRON: (process.env.NEXT_PUBLIC_WALLET_USDT_TRON as string) || "",
} as const;

export function getPaypalAvailableCurrencies(): Currency[] {
    return ENV.paypalAvailableCcys
        .split(",")
        .map((s) => s.trim())
        .filter(isCurrency) as Currency[];
}

export function getPaypalDefaultCurrency(availableCcys: Currency[]): Currency {
    const defaultCcy = ENV.paypalDefaultCcy;
    return (
        isCurrency(defaultCcy) && availableCcys.includes(defaultCcy as Currency)
            ? (defaultCcy as Currency)
            : (availableCcys[0] ?? "USD")
    ) as Currency;
}

export function getBuyMeACoffeeSlug(): string {
    try {
        const url = new URL(ENV.bmacUrl);
        return url.pathname.replace(/\//g, "") || "";
    } catch {
        return "";
    }
}

export function getCryptoAddress(envKey: string): string {
    if (typeof window === "undefined") return "";
    return (process.env[envKey as any] as string) || "";
}