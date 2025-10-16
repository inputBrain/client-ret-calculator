import { useMemo } from "react";
import { type Currency } from "@/lib/currency";
import { monoLinks, paypalEmail, paypalMeUrl } from "@/lib/donation-helper";

interface UsePaymentUrlsProps {
    // Monobank
    monoCcy: Currency;
    monoAmount: number | null;

    // PayPal
    paypalCcy: Currency;
    paypalAmount: number | null;

    // Crypto
    cryptoAddress: string;
}

interface PaymentUrls {
    // Monobank
    monoUrl: string;
    monoHref: string;

    // PayPal
    paypalUrl: string;

    // Crypto
    cryptoQrUrl: string;
}

export function usePaymentUrls({
    monoCcy,
    monoAmount,
    paypalCcy,
    paypalAmount,
    cryptoAddress,
}: UsePaymentUrlsProps): PaymentUrls {

    // ✅ Monobank URL
    const monoUrl = useMemo(() => {
        return (monoLinks as any)?.[monoCcy] || "";
    }, [monoCcy]);

    const monoHref = useMemo(() => {
        if (!monoUrl) return "#";
        return monoAmount != null
            ? `${monoUrl}?amount=${monoAmount}`
            : monoUrl;
    }, [monoUrl, monoAmount]);

    // ✅ PayPal URL
    const paypalUrl = useMemo(() => {
        const amt = typeof paypalAmount === "number" ? paypalAmount : undefined;
        const email = (paypalEmail || "").trim();

        // Варіант 1: PayPal Donate (через email)
        if (email) {
            const base = "https://www.paypal.com/donate";
            const params = new URLSearchParams({
                business: email,
                currency_code: paypalCcy,
            });
            if (amt) params.set("amount", amt.toFixed(2));
            return `${base}?${params.toString()}`;
        }

        // Варіант 2: PayPal.me
        if (paypalMeUrl) {
            if (amt) {
                const base = paypalMeUrl.endsWith("/")
                    ? paypalMeUrl.slice(0, -1)
                    : paypalMeUrl;
                return `${base}/${amt}${paypalCcy}`;
            }
            return paypalMeUrl;
        }

        return "";
    }, [paypalAmount, paypalCcy]);

    // ✅ Crypto QR Code URL
    const cryptoQrUrl = useMemo(() => {
        if (!cryptoAddress) return "";
        const payload = encodeURIComponent(cryptoAddress);
        return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${payload}`;
    }, [cryptoAddress]);

    return {
        monoUrl,
        monoHref,
        paypalUrl,
        cryptoQrUrl,
    };
}