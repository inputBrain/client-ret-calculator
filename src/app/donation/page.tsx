"use client";
import React, { useMemo } from "react";
import { getCurrencySymbol } from "@/lib/currency";
import { monoLinks, paypalEmail } from "@/lib/donation-helper";
import {
    ENV,
    getPaypalAvailableCurrencies,
    getPaypalDefaultCurrency,
    getCryptoAddress,
} from "@/lib/donation-constants";
import { useDonationState } from "@/hooks/useDonationState";
import { usePaymentUrls } from "@/hooks/usePaymentUrls";
import { PaymentMethodTabs } from "@/components/donation/PaymentMethodTabs";
import { AmountSelector } from "@/components/donation/AmountSelector";
import { CryptoPayment } from "@/components/donation/CryptoPayment";
import { MonobankPayment } from "@/components/donation/MonobankPayment";
import { PayPalPayment } from "@/components/donation/PayPalPayment";
import { BuyMeACoffeePayment } from "@/components/donation/BuyMeACoffeePayment";

export default function DonatePage() {
    const paypalAvailableCcys = useMemo(() => getPaypalAvailableCurrencies(), []);
    const paypalDefaultCcy = useMemo(
        () => getPaypalDefaultCurrency(paypalAvailableCcys),
        [paypalAvailableCcys]
    );

    const paypalAvailableMap = useMemo(() => {
        const map: Record<string, string> = {};
        for (const c of paypalAvailableCcys) map[c] = c;
        return map;
    }, [paypalAvailableCcys]);

    const state = useDonationState({
        paypalDefaultCcy,
        paypalAvailableCcys,
    });

    const urls = usePaymentUrls({
        monoCcy: state.monoCcy,
        monoAmount: state.finalAmount,
        paypalCcy: state.paypalCcy,
        paypalAmount: state.finalAmount,
        cryptoAddress: "", // не потрібно
    });

    const amountSymbol = useMemo(() => {
        if (state.method === "uah") return getCurrencySymbol(state.monoCcy);
        if (state.method === "paypal") return getCurrencySymbol(state.paypalCcy);
        return "";
    }, [state.method, state.monoCcy, state.paypalCcy]);

    return (
        <main className="min-h-screen text-slate-900">
            <section className="mx-auto max-w-3xl px-4 py-10">

                <header className="mb-8 text-center">
                    <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                        Support this project
                    </h1>
                    <p className="mt-3 text-slate-600">
                        Choose a method below: Crypto, UAH (monoбанка), PayPal, or Buy Me a Coffee.
                    </p>
                </header>

                <PaymentMethodTabs method={state.method} onMethodChange={state.setMethod} />

                {(state.method === "uah" || state.method === "paypal") && (
                    <AmountSelector
                        method={state.method}
                        amountInput={state.amountInput}
                        onAmountInputChange={state.setAmountInput}
                        finalAmount={state.finalAmount}
                        onPresetClick={state.setPresetAmount}
                        amountSymbol={amountSymbol}
                        monoCcy={state.monoCcy}
                        onMonoCcyChange={state.setMonoCcy}
                        monoAvailableMap={monoLinks}
                        paypalCcy={state.paypalCcy}
                        onPaypalCcyChange={state.setPaypalCcy}
                        paypalAvailableMap={paypalAvailableMap}
                    />
                )}

                <div className={state.method === "bmac" || state.method === "crypto" ? "" : "mt-8"}>
                    {state.method === "crypto" && (
                        <CryptoPayment />
                    )}

                    {state.method === "uah" && (
                        <MonobankPayment
                            currency={state.monoCcy}
                            amount={state.finalAmount}
                            monoHref={urls.monoHref}
                            hasMonoUrl={!!urls.monoUrl}
                        />
                    )}

                    {state.method === "paypal" && (
                        <PayPalPayment
                            currency={state.paypalCcy}
                            amount={state.finalAmount}
                            paypalUrl={urls.paypalUrl}
                            paypalEmail={paypalEmail}
                        />
                    )}

                    {state.method === "bmac" && (
                        <BuyMeACoffeePayment
                            bmacUrl={ENV.bmacUrl}
                            amount={state.finalAmount}
                        />
                    )}
                </div>

                <footer className="mt-10 text-center text-xs text-slate-500">
                    <p>Thank you for your support 💛</p>
                </footer>
            </section>
        </main>
    );
}