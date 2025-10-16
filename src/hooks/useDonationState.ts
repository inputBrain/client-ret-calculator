import { useState, useMemo, useCallback } from "react";
import { type Currency, isCurrency } from "@/lib/currency";
import { tokens } from "@/lib/donation-helper";
import { parseAmount } from "@/lib/utils";

export type PaymentMethod = "crypto" | "uah" | "paypal" | "bmac";

export interface DonationState {
    // Метод оплати
    method: PaymentMethod;
    setMethod: (method: PaymentMethod) => void;

    // Сума
    amountInput: string;
    setAmountInput: (value: string) => void;
    finalAmount: number | null;
    setPresetAmount: (amount: number) => void;

    // Monobank
    monoCcy: Currency;
    setMonoCcy: (ccy: Currency) => void;

    // PayPal
    paypalCcy: Currency;
    setPaypalCcy: (ccy: Currency) => void;
    paypalAvailableCcys: Currency[];

    // Crypto
    tokenKey: string;
    setTokenKey: (key: string) => void;
    networkKey: string;
    setNetworkKey: (key: string) => void;
    activeToken: typeof tokens[number];
    activeNetwork: typeof tokens[number]["networks"][number];
}

interface UseDonationStateProps {
    paypalDefaultCcy: Currency;
    paypalAvailableCcys: Currency[];
}

export function useDonationState({
    paypalDefaultCcy,
    paypalAvailableCcys,
}: UseDonationStateProps): DonationState {
    // ✅ Метод оплати
    const [method, setMethod] = useState<PaymentMethod>("bmac");

    // ✅ Сума
    const [amountInput, setAmountInput] = useState<string>("");

    const finalAmount = useMemo(() => {
        return parseAmount(amountInput);
    }, [amountInput]);

    const setPresetAmount = useCallback((amount: number) => {
        setAmountInput(String(amount));
    }, []);

    // ✅ Monobank
    const [monoCcy, setMonoCcy] = useState<Currency>("UAH");

    // ✅ PayPal
    const [paypalCcy, setPaypalCcy] = useState<Currency>(paypalDefaultCcy);

    // ✅ Crypto
    const [tokenKey, setTokenKey] = useState(tokens[0].key);
    const [networkKey, setNetworkKey] = useState(tokens[0].networks[0].key);

    const activeToken = useMemo(
        () => tokens.find((t) => t.key === tokenKey)!,
        [tokenKey]
    );

    const activeNetwork = useMemo(
        () => activeToken.networks.find((n) => n.key === networkKey)!,
        [activeToken, networkKey]
    );

    // ✅ Синхронізація tokenKey та networkKey
    const handleSetTokenKey = useCallback((key: string) => {
        const token = tokens.find((t) => t.key === key);
        if (token) {
            setTokenKey(key);
            setNetworkKey(token.networks[0].key);
        }
    }, []);

    return {
        method,
        setMethod,

        amountInput,
        setAmountInput,
        finalAmount,
        setPresetAmount,

        monoCcy,
        setMonoCcy,

        paypalCcy,
        setPaypalCcy,
        paypalAvailableCcys,

        tokenKey,
        setTokenKey: handleSetTokenKey,
        networkKey,
        setNetworkKey,
        activeToken,
        activeNetwork,
    };
}