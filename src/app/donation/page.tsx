"use client";
import Image from "next/image";

import {toast} from "react-toastify";

import React, {useEffect, useMemo, useState} from "react";
import {
    SiBitcoin,
    SiEthereum,
    SiTether,
    SiPaypal,
    SiBuymeacoffee,
    SiThirdweb,
} from "react-icons/si";
import {Banknote} from "lucide-react";
import {getCurrencySymbol, CURRENCY_META, type Currency, isCurrency} from "@/lib/currency";
import {buyMeACoffee, monoLinks, paypalCurrency, paypalDonateUrl, paypalEmail, paypalMeUrl, preset, tokens} from "@/lib/donation-helper";
import {CurrencyDropdown} from "@/components/ui/CurrencyDropdown";

export default function DonatePage() {
    const [method, setMethod] = useState<"crypto" | "uah" | "paypal" | "bmac">("bmac");
    // const [custom, setCustom] = useState<string>("");
    // const [amount, setAmount] = React.useState<number | null>(null);
    const [monoCcy, setMonoCcy] = React.useState<Currency>("UAH");

    const [amountInput, setAmountInput] = useState<string>("");
    const finalAmount = useMemo(() => {
        const raw = (amountInput ?? "").toString().trim().replace(",", ".");
        const cleaned = raw.replace(/[^\d.]/g, "");
        if (!cleaned) return null;
        const n = Number(cleaned);
        return Number.isFinite(n) && n > 0 ? n : null;
    }, [amountInput]);


    const paypalDefaultCcyEnv = ((process.env.NEXT_PUBLIC_PAYPAL_DEFAULT_CCY as string) || "USD").toUpperCase();
    const paypalAvailableEnv = ((process.env.NEXT_PUBLIC_PAYPAL_AVAILABLE_CCYS as string) || "USD").toUpperCase();

    const paypalAvailableCcys = useMemo<Currency[]>(() => {
        return paypalAvailableEnv
            .split(",")
            .map((s) => s.trim())
            .filter(isCurrency) as Currency[];
    }, [paypalAvailableEnv]);

    const paypalDefaultCcy: Currency =
        (isCurrency(paypalDefaultCcyEnv) && paypalAvailableCcys.includes(paypalDefaultCcyEnv as Currency)
            ? (paypalDefaultCcyEnv as Currency)
            : (paypalAvailableCcys[0] ?? "USD")) as Currency;

    const [paypalCcy, setPaypalCcy] = useState<Currency>(paypalDefaultCcy);

    const paypalAvailableMap = useMemo(() => {
        const o: Record<string, string> = {};
        for (const c of paypalAvailableCcys) o[c] = c;
        return o;
    }, [paypalAvailableCcys]);


    useEffect(() => {
        if (method === "paypal" && !paypalAvailableCcys.includes(paypalCcy)) {
            setPaypalCcy(paypalDefaultCcy);
        }
    }, [method, paypalCcy, paypalAvailableCcys, paypalDefaultCcy]);


    const amountSymbol = useMemo(() => {
        if (method === "uah") return getCurrencySymbol(monoCcy);
        if (method === "paypal") return getCurrencySymbol(paypalCcy);
        return "";
    }, [method, monoCcy, paypalCcy]);


    const activeMonoUrl = (monoCcy && (monoLinks as any)?.[monoCcy as keyof typeof monoLinks]) || "";
    const monoHref = useMemo(() => {
        if (!activeMonoUrl) return "#";
        return finalAmount != null
            ? `${activeMonoUrl}?amount=${finalAmount}`
            : activeMonoUrl;
    }, [activeMonoUrl, finalAmount]);


    const buyMeACoffee = (process.env.NEXT_PUBLIC_BMAC_URL as string) || "";
    // вытягиваем slug из https://www.buymeacoffee.com/<slug>
    const bmacSlug = useMemo(() => {
        try {
            const u = new URL(buyMeACoffee);
            const p = u.pathname.replace(/\//g, "");
            return p || "";
        } catch {
            return "";
        }
    }, [buyMeACoffee]);


    const [tokenKey, setTokenKey] = useState(tokens[0].key);
    const activeToken = useMemo(
        () => tokens.find((t) => t.key === tokenKey)!,
        [tokenKey]
    );
    const [networkKey, setNetworkKey] = useState(activeToken.networks[0].key);
    const activeNetwork = useMemo(
        () => activeToken.networks.find((n) => n.key === networkKey)!,
        [activeToken, networkKey]
    );

    // env as before
    const address = useMemo(
        () =>
            (typeof window !== "undefined"
                ? (process.env[activeNetwork.envKey as any] as string)
                : "") || "",
        [activeNetwork.envKey]
    );


    const cryptoQrSrc = useMemo(() => {
        const data = address || "";
        if (!data) return "";
        const payload = encodeURIComponent(data);
        return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${payload}`;
    }, [address]);

    const paypalUrl = useMemo(() => {
        const amt = typeof finalAmount === "number" ? finalAmount : undefined;
        const email = (paypalEmail || "").trim();
        if (email) {
            const base = "https://www.paypal.com/donate";
            const qs = new URLSearchParams({
                business: email,
                currency_code: paypalCcy,
            });
            if (amt) qs.set("amount", amt.toFixed(2));
            return `${base}?${qs.toString()}`;
        }
        if (paypalMeUrl) {
            if (amt) {
                const base = paypalMeUrl.endsWith("/") ? paypalMeUrl.slice(0, -1) : paypalMeUrl;
                return `${base}/${amt}${paypalCcy}`;
            }
            return paypalMeUrl;
        }
        return "";
    }, [paypalEmail, paypalMeUrl, paypalCcy, finalAmount]);


    const iconCls = "h-4 w-4";

    const tokenIcon = (k: string) => {
        if (k === "btc") return <SiBitcoin className={iconCls}/>;
        if (k === "eth") return <SiEthereum className={iconCls}/>;
        return <SiTether className={iconCls}/>;
    };

    const networkIcon = (k: string) => {
        if (k === "bitcoin") return <SiBitcoin className={iconCls}/>;
        if (k === "ethereum" || k === "erc20") return <SiEthereum className={iconCls}/>;
        if (k === "tron" || k === "trc20") {
            return (
                <Image
                    src="/crypto-icons/tron-trx-logo.png"
                    alt="TRON"
                    width={24}
                    height={24}
                    className={iconCls}
                />
            );
        }
        return null;
    };

    // tabs + animated indicator
    const tabs = [
        {
            k: "bmac",
            l: (
                <span className="inline-flex items-center gap-2">
          <SiBuymeacoffee className={iconCls}/> Buy Me a Coffee
        </span>
            ),
        },
        {
            k: "paypal",
            l: (
                <span className="inline-flex items-center gap-2">
          <SiPaypal className={iconCls}/> PayPal
        </span>
            ),
        },
        {
            k: "uah",
            l: (
                <span className="inline-flex items-center gap-2">
          <Banknote className={iconCls}/> Monobank
        </span>
            ),
        },
        {
            k: "crypto",
            l: (
                <span className="inline-flex items-center gap-2">
          <SiThirdweb className={iconCls}/> Crypto
        </span>
            ),
        },
    ] as const;

    const activeIdx = tabs.findIndex((t) => t.k === method);

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

                {/* TABS with animated indicator */}
                <div className="mb-6 relative grid grid-cols-4 rounded-2xl border border-gray-100 bg-white p-1 backdrop-blur shadow-[0_10px_30px_-1px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.04)] overflow-hidden">
                    {/* moving pill indicator */}
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-1 left-1 w-1/4 rounded-xl border border-indigo-200 bg-indigo-50 shadow-sm will-change-transform motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-reduce:transition-none"
                        style={{transform: `translateX(${activeIdx * 100}%)`}}
                    />

                    {tabs.map((t) => (
                        <button
                            key={t.k}
                            onClick={() => setMethod(t.k as any)}
                            className={`
                relative z-10 rounded-xl py-2 text-sm sm:text-base font-medium
                border border-transparent
                transition-[color,transform] duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200
                ${method === t.k ? "text-indigo-800 scale-[1.02]" : "text-slate-700 hover:text-slate-900"}
              `}
                            aria-pressed={method === t.k}
                        >
                            {t.l}
                        </button>
                    ))}
                </div>

                {/* AMOUNT */}
                <div className="mb-8 rounded-3xl border border-gray-100 bg-white p-5 sm:p-6 shadow-[0_10px_30px_-1px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.04)]">
                    <h2 className="mb-4 text-lg font-semibold text-slate-900">Amount</h2>

                    <div className="flex flex-wrap gap-2">
                        {preset.map((v) => {
                            const isActive = finalAmount === v; // пресет активен, если совпадает с инпутом
                            return (
                                <button
                                    key={v}
                                    onClick={() => setAmountInput(String(v))} // синхронизируем ИНПУТ
                                    className={`rounded-xl px-4 py-2 text-sm font-medium border transition ${
                                        isActive
                                            ? "border-indigo-300 bg-indigo-50 text-indigo-800 shadow-sm"
                                            : "border-slate-200 text-slate-700 hover:bg-slate-50"
                                    }`}
                                >
                                    {v}
                                </button>
                            );
                        })}

                        {/* кастомная сумма — тот же источник правды */}
                        <div className="relative">
                            <input
                                aria-label="Custom amount"
                                inputMode="decimal"
                                type="text"
                                placeholder=""
                                value={amountInput}
                                onFocus={(e) => e.currentTarget.select()}
                                onChange={(e) => {
                                    // допускаем цифры, запятую/точку; нормализуем в useMemo
                                    const raw = e.target.value.replace(/[^\d.,]/g, "");
                                    setAmountInput(raw);
                                }}
                                style={{
                                    width: `calc(${Math.max(6, (amountInput || "").length)}ch + 2.75rem)`,
                                }}
                                className="flex h-11 w-24 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-[15px] text-slate-900 shadow-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 focus:outline-none focus-visible:outline-none"
                            />
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
        {amountSymbol}
      </span>
                        </div>

                        {/* Селект валют сразу после поля */}
                        {method === "uah" && (
                            <CurrencyDropdown
                                value={monoCcy}
                                onChange={(ccy) => isCurrency(ccy) && setMonoCcy(ccy)}
                                availableMap={monoLinks}
                            />
                        )}

                        {method === "paypal" && (
                            <CurrencyDropdown
                                value={paypalCcy}
                                onChange={(ccy) => isCurrency(ccy) && setPaypalCcy(ccy)}
                                availableMap={paypalAvailableMap as any}
                            />
                        )}
                    </div>

                    <p className="mt-3 text-sm text-slate-600" aria-live="polite">
                        Selected amount:{" "}
                        <span className="font-semibold text-slate-900">
      {finalAmount ?? "—"}
    </span>{" "}
                        {amountSymbol}
                    </p>
                </div>

                {method === "crypto" && (
                    <div className="rounded-3xl border border-gray-100 bg-white p-5 sm:p-6 shadow-[0_10px_30px_-1px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.04)]">
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold inline-flex items-center gap-2 text-slate-900">
                                    <SiThirdweb className={iconCls}/> Crypto
                                </h2>
                                <p className="text-sm text-slate-600">
                                    Pick a token and network. Addresses are read from env.
                                </p>
                            </div>
                        </div>

                        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm text-slate-700">Token</label>
                                <div className="flex flex-wrap gap-2">
                                    {tokens.map((t) => (
                                        <button
                                            key={t.key}
                                            onClick={() => {
                                                setTokenKey(t.key);
                                                setNetworkKey(t.networks[0].key);
                                            }}
                                            className={`rounded-xl px-3 py-2 text-sm border inline-flex items-center gap-2 transition focus-visible:ring-2 focus-visible:ring-indigo-200 ${
                                                tokenKey === t.key
                                                    ? "border-indigo-300 bg-indigo-50 text-indigo-800 shadow-sm"
                                                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                                            }`}
                                        >
                                            {tokenIcon(t.key)}
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm text-slate-700">Network</label>
                                <div className="flex flex-wrap gap-2">
                                    {activeToken.networks.map((n) => (
                                        <button
                                            key={n.key}
                                            onClick={() => setNetworkKey(n.key)}
                                            className={`rounded-xl px-3 py-2 text-sm border inline-flex items-center gap-2 transition focus-visible:ring-2 focus-visible:ring-indigo-200 ${
                                                networkKey === n.key
                                                    ? "border-indigo-300 bg-indigo-50 text-indigo-800 shadow-sm"
                                                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                                            }`}
                                        >
                                            {networkIcon(n.key)}
                                            {n.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm text-slate-700">Address</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        readOnly
                                        value={address}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
                                    />
                                    <button
                                        onClick={() => address && navigator.clipboard.writeText(address)}
                                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                                    >
                                        Copy
                                    </button>
                                </div>
                                <p className="mt-2 text-xs text-slate-500">
                                    Always double-check the network before sending.
                                </p>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                {address ? (
                                    <img
                                        src={cryptoQrSrc}
                                        alt="Wallet QR"
                                        className="h-60 w-60 rounded-2xl border border-slate-200 bg-white p-3"
                                    />
                                ) : (
                                    <div className="h-60 w-60 rounded-2xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-500 text-sm">
                                        Set wallet env
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {method === "uah" && (
                    <div className="rounded-3xl border border-gray-100 bg-white p-5 sm:p-6 shadow-[0_10px_30px_-1px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.04)]">
                        <h2 className="mb-2 text-lg font-semibold inline-flex items-center gap-2 text-slate-900">
                            <Banknote className={iconCls}/> Donate with Monobank
                        </h2>
                        <p className="mb-4 text-sm text-slate-600">
                            Choose amount & currency, then open the public jar.
                        </p>

                        {/* выбора валют здесь больше нет — он перенесён в Amount */}

                        <div className="flex flex-wrap items-center gap-3">
                            <a
                                href={monoHref}
                                target="_blank"
                                rel="noreferrer noopener"
                                className={`rounded-xl px-5 py-3 text-sm font-medium shadow-sm transition inline-flex items-center gap-2 ${
                                    activeMonoUrl ? "bg-indigo-600 text-white hover:bg-indigo-700" : "pointer-events-none bg-slate-200 text-slate-400"
                                }`}
                            >
                                <Banknote className={iconCls}/>
                                Open Monobank ({monoCcy})
                            </a>
                            <span className="text-xs text-slate-600">
                Amount: {finalAmount ?? "—"} {getCurrencySymbol(monoCcy)}
              </span>
                        </div>
                    </div>
                )}

                {method === "paypal" && (
                    <div className="rounded-3xl border border-gray-100 bg-white p-5 sm:p-6 shadow-[0_10px_30px_-1px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.04)]">
                        <h2 className="mb-2 text-lg font-semibold inline-flex items-center gap-2 text-slate-900">
                            <SiPaypal className={iconCls}/> PayPal
                        </h2>
                        <p className="mb-4 text-sm text-slate-600">
                            Use PayPal Donate or PayPal.me.
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                            <a
                                href={paypalUrl || "#"}
                                target="_blank"
                                rel="noreferrer noopener"
                                className={`rounded-xl px-5 py-3 text-sm font-medium shadow-sm transition inline-flex items-center gap-2 ${
                                    paypalUrl
                                        ? "bg-sky-500 text-white hover:bg-sky-600"
                                        : "pointer-events-none bg-slate-200 text-slate-400"
                                }`}
                            >
                                <SiPaypal className={iconCls}/> Open PayPal
                            </a>
                            <span className="text-xs text-slate-600">
                                 Suggested: {finalAmount ?? "—"} {paypalCurrency}
                            </span>
                        </div>
                        <div className="mt-5">
                            <label className="mb-1 block text-sm text-slate-700">
                                PayPal email
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    readOnly
                                    value={paypalEmail}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
                                />

                                <button
                                    onClick={async () => {
                                        if (!paypalEmail) return;
                                        try {
                                            await navigator.clipboard.writeText(paypalEmail);
                                            toast.success("copied!"); // можно без extra-опций — возьмёт из контейнера
                                        } catch {
                                            toast.error("not copied :(");
                                        }
                                    }}
                                    className="inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5
                                     text-sm font-medium transition select-none border-slate-200 bg-white/90
                                      text-slate-800 shadow-sm hover:bg-slate-50 hover:shadow active:scale-95
                                      active:bg-slate-100 active:shadow-sm focus:outline-none focus-visible:ring-2
                                       focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {method === "bmac" && (
                    <div className="rounded-3xl border border-gray-100 bg-white p-5 sm:p-6 shadow-[0_10px_30px_-1px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.04)]">
                        <h2 className="mb-2 text-lg font-semibold inline-flex items-center gap-2 text-slate-900">
                            <SiBuymeacoffee className={iconCls}/> Buy Me a Coffee
                        </h2>
                        <p className="mb-4 text-sm text-slate-600">
                            Quick small one-time support.
                        </p>
                        <a
                            href={buyMeACoffee || "#"}
                            target="_blank"
                            rel="noreferrer noopener"
                            className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium shadow-sm transition ${
                                buyMeACoffee
                                    ? "bg-yellow-400 text-black hover:bg-yellow-300"
                                    : "pointer-events-none bg-slate-200 text-slate-400"
                            }`}
                        >
                            <SiBuymeacoffee className={iconCls}/> Open Buy Me a Coffee
                        </a>
                        <p className="mt-3 text-xs text-slate-600">
                            Suggested: {finalAmount || "—"}
                        </p>
                    </div>
                )}

                <footer className="mt-10 text-center text-xs text-slate-500">
                    <p>Thank you for your support 💛</p>
                </footer>
            </section>
        </main>
    );
}