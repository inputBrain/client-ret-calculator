"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { SiBitcoin, SiEthereum, SiTether, SiPaypal, SiBuymeacoffee, SiThirdweb } from "react-icons/si";
import { Banknote } from "lucide-react";

export default function DonatePage() {
    const [method, setMethod] = useState<"crypto" | "uah" | "paypal" | "bmac">("crypto");
    const [amount, setAmount] = useState<number | "">(200);
    const [custom, setCustom] = useState<string>("");

    const preset = [100, 200, 500, 1000];

    const tokens: Array<{
        key: string;
        label: string;
        networks: Array<{ key: string; label: string; envKey: string }>;
    }> = [
        { key: "btc", label: "Bitcoin (BTC)", networks: [{ key: "bitcoin", label: "Bitcoin", envKey: "NEXT_PUBLIC_WALLET_BTC" }] },
        { key: "eth", label: "Ethereum (ETH)", networks: [{ key: "ethereum", label: "Ethereum", envKey: "NEXT_PUBLIC_WALLET_ETH" }] },
        {
            key: "usdt",
            label: "Tether (USDT)",
            networks: [
                { key: "erc20", label: "ERC20 (Ethereum)", envKey: "NEXT_PUBLIC_WALLET_USDT_ETH" },
                { key: "trc20", label: "TRC20 (Tron)", envKey: "NEXT_PUBLIC_WALLET_USDT_TRON" },
            ],
        },
    ];

    const [tokenKey, setTokenKey] = useState(tokens[0].key);
    const activeToken = useMemo(() => tokens.find((t) => t.key === tokenKey)!, [tokenKey]);
    const [networkKey, setNetworkKey] = useState(activeToken.networks[0].key);
    const activeNetwork = useMemo(() => activeToken.networks.find((n) => n.key === networkKey)!, [activeToken, networkKey]);

    // env (client-side NEXT_PUBLIC_*)
    const address = useMemo(
        () => (typeof window !== "undefined" ? ((process.env as any)[activeNetwork.envKey] as string) : "") || "",
        [activeNetwork.envKey]
    );
    const monobankJar = (process.env.NEXT_PUBLIC_MONOBANK_JAR_URL as string) || "";
    const buyMeACoffee = (process.env.NEXT_PUBLIC_BMAC_URL as string) || "";
    const paypalDonateUrl = (process.env.NEXT_PUBLIC_PAYPAL_DONATE_URL as string) || "";
    const paypalMeUrl = (process.env.NEXT_PUBLIC_PAYPAL_ME_URL as string) || "";
    const paypalEmail = (process.env.NEXT_PUBLIC_PAYPAL_EMAIL as string) || "";
    const paypalCurrency = (process.env.NEXT_PUBLIC_PAYPAL_CURRENCY as string) || "USD";

    const finalAmount = useMemo(() => {
        if (custom !== "") {
            const n = Number(custom.replace(/,/g, "."));
            if (!Number.isNaN(n) && n > 0) return n;
            return "";
        }
        return amount;
    }, [amount, custom]);

    const cryptoQrSrc = useMemo(() => {
        const data = address || "";
        if (!data) return "";
        const payload = encodeURIComponent(data);
        return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${payload}`;
    }, [address]);

    const paypalUrl = useMemo(() => {
        const amt = typeof finalAmount === "number" ? finalAmount : undefined;
        if (paypalDonateUrl) {
            const sep = paypalDonateUrl.includes("?") ? "&" : "?";
            return amt ? `${paypalDonateUrl}${sep}amount=${amt}` : paypalDonateUrl;
        }
        if (paypalMeUrl) {
            const base = paypalMeUrl.endsWith("/") ? paypalMeUrl.slice(0, -1) : paypalMeUrl;
            return amt ? `${base}/${amt}${paypalCurrency ? paypalCurrency : ""}` : paypalMeUrl;
        }
        return "";
    }, [paypalDonateUrl, paypalMeUrl, paypalCurrency, finalAmount]);

    const iconCls = "h-4 w-4";

    const tokenIcon = (k: string) => {
        if (k === "btc") return <SiBitcoin className={iconCls} />;
        if (k === "eth") return <SiEthereum className={iconCls} />;
        return <SiTether className={iconCls} />;
    };
    const networkIcon = (k: string) => {
        if (k === "bitcoin") return <SiBitcoin className={iconCls} />;
        if (k === "ethereum" || k === "erc20") return <SiEthereum className={iconCls} />;
        if (k === "tron" || k === "trc20") {
            return <Image src="/crypto-icons/tron-trx-logo.png" alt="TRON" width={24} height={24} className="h-4 w-4" />;
        }
        return null;
    };

    // ——— стили (единый язык UI с остальным сайтом) ———
    const pageWrap = "container mx-auto max-w-6xl px-4 pt-24 pb-20";
    const card = "rounded-2xl border border-gray-100 bg-white shadow-[0_10px_30px_-1px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.04)]";
    const section = `${card} p-6 sm:p-8`;
    const pill =
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200";
    const pillMuted = "border border-gray-200 text-slate-700 hover:bg-indigo-50";
    const pillActive = "border border-indigo-200 bg-indigo-50 text-indigo-800";
    const minor = "text-sm text-slate-600";
    const label = "mb-1 block text-sm font-medium text-slate-700";
    const input =
        "w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-0";

    return (
        <main className="bg-white text-slate-900">
            <section className={pageWrap}>
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">Support this project</h1>
                    <p className="mt-3 text-slate-600">
                        Choose a method below: <span className="font-medium">Crypto</span>, <span className="font-medium">UAH</span>,{" "}
                        <span className="font-medium">PayPal</span> or <span className="font-medium">Buy Me a Coffee</span>.
                    </p>
                </div>

                {/* Method tabs */}
                <div className={`${card} mb-8 p-1.5 flex items-center gap-2`}>
                    {[
                        { k: "crypto", l: <span className="inline-flex items-center gap-2"><SiThirdweb className={iconCls} /> Crypto</span> },
                        { k: "uah", l: <span className="inline-flex items-center gap-2"><Banknote className={iconCls} /> UAH (банка)</span> },
                        { k: "paypal", l: <span className="inline-flex items-center gap-2"><SiPaypal className={iconCls} /> PayPal</span> },
                        { k: "bmac", l: <span className="inline-flex items-center gap-2"><SiBuymeacoffee className={iconCls} /> Buy Me a Coffee</span> },
                    ].map((t) => (
                        <button
                            key={t.k}
                            onClick={() => setMethod(t.k as any)}
                            className={`${pill} ${method === (t.k as any) ? pillActive : pillMuted}`}
                        >
                            {t.l}
                        </button>
                    ))}
                </div>

                {/* Amount */}
                <div className={section}>
                    <h2 className="mb-4 text-lg font-semibold text-slate-900">Amount</h2>
                    <div className="flex flex-wrap gap-2">
                        {preset.map((v) => (
                            <button
                                key={v}
                                onClick={() => {
                                    setAmount(v);
                                    setCustom("");
                                }}
                                className={`${pill} ${
                                    amount === v && custom === "" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : pillMuted
                                }`}
                            >
                                {v}
                            </button>
                        ))}
                        <div className="relative">
                            <input
                                inputMode="decimal"
                                placeholder="Custom"
                                value={custom}
                                onChange={(e) => {
                                    setCustom(e.target.value);
                                    setAmount(0);
                                }}
                                className={`${input} w-32`}
                            />
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">USD/UAH</span>
                        </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">
                        Selected amount: <span className="font-semibold text-slate-900">{finalAmount || "—"}</span>
                    </p>
                </div>

                {/* Crypto */}
                {method === "crypto" && (
                    <div className="mt-8 grid gap-8 md:grid-cols-2">
                        <div className={section}>
                            <div className="mb-4">
                                <h2 className="text-lg font-semibold text-slate-900">Crypto</h2>
                                <p className={minor}>Pick a token and network. Addresses are read from env.</p>
                            </div>

                            <div className="mb-5">
                                <label className={label}>Token</label>
                                <div className="flex flex-wrap gap-2">
                                    {tokens.map((t) => (
                                        <button
                                            key={t.key}
                                            onClick={() => {
                                                setTokenKey(t.key);
                                                setNetworkKey(t.networks[0].key);
                                            }}
                                            className={`${pill} ${tokenKey === t.key ? pillActive : pillMuted}`}
                                        >
                                            {tokenIcon(t.key)}
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-5">
                                <label className={label}>Network</label>
                                <div className="flex flex-wrap gap-2">
                                    {activeToken.networks.map((n) => (
                                        <button
                                            key={n.key}
                                            onClick={() => setNetworkKey(n.key)}
                                            className={`${pill} ${networkKey === n.key ? pillActive : pillMuted}`}
                                        >
                                            {networkIcon(n.key)}
                                            {n.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-5 md:grid-cols-1">
                                <div>
                                    <label className={label}>Address</label>
                                    <div className="flex items-center gap-2">
                                        <input readOnly value={address} className={input} />
                                        <button
                                            onClick={() => address && navigator.clipboard.writeText(address)}
                                            className={`${pill} ${pillMuted} h-10`}
                                        >
                                            Copy
                                        </button>
                                    </div>
                                    <p className="mt-2 text-xs text-slate-500">Always double-check the network before sending.</p>
                                </div>
                            </div>
                        </div>

                        <div className={`${section} flex items-center justify-center`}>
                            {address ? (
                                <img
                                    src={cryptoQrSrc}
                                    alt="Wallet QR"
                                    className="h-60 w-60 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm"
                                />
                            ) : (
                                <div className="h-60 w-60 rounded-2xl border border-dashed border-gray-200 bg-slate-50 flex items-center justify-center text-slate-500 text-sm">
                                    Set wallet env
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* UAH */}
                {method === "uah" && (
                    <div className={`${section} mt-8`}>
                        <h2 className="mb-2 text-lg font-semibold text-slate-900 inline-flex items-center gap-2">
                            <Banknote className={iconCls} /> Donate in UAH
                        </h2>
                        <p className={minor}>Redirect to monoбанка (public jar).</p>
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            <a
                                href={monobankJar || "#"}
                                target="_blank"
                                rel="noreferrer noopener"
                                className={`${pill} ${
                                    monobankJar
                                        ? "bg-emerald-500 text-black hover:bg-emerald-400 border border-emerald-400"
                                        : "pointer-events-none border border-gray-200 text-slate-400"
                                }`}
                            >
                                Open monoбанка
                            </a>
                            <span className="text-xs text-slate-500">
                Amount: {finalAmount || "—"}
              </span>
                        </div>
                        <p className="mt-3 text-xs text-slate-500">For precise amounts, you can specify it after opening the jar.</p>
                    </div>
                )}

                {/* PayPal */}
                {method === "paypal" && (
                    <div className={`${section} mt-8`}>
                        <h2 className="mb-2 text-lg font-semibold text-slate-900 inline-flex items-center gap-2">
                            <SiPaypal className={iconCls} /> PayPal
                        </h2>
                        <p className={minor}>Use PayPal Donate or PayPal.me.</p>
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            <a
                                href={paypalUrl || "#"}
                                target="_blank"
                                rel="noreferrer noopener"
                                className={`${pill} ${
                                    paypalUrl
                                        ? "bg-sky-400 text-black hover:bg-sky-300 border border-sky-300"
                                        : "pointer-events-none border border-gray-200 text-slate-400"
                                }`}
                            >
                <span className="inline-flex items-center gap-2">
                  <SiPaypal className={iconCls} /> Open PayPal
                </span>
                            </a>
                            <span className="text-xs text-slate-500">
                Suggested: {finalAmount || "—"} {paypalCurrency}
              </span>
                        </div>

                        <div className="mt-6">
                            <label className={label}>PayPal email</label>
                            <div className="flex items-center gap-2">
                                <input readOnly value={paypalEmail} className={input} />
                                <button
                                    onClick={() => paypalEmail && navigator.clipboard.writeText(paypalEmail)}
                                    className={`${pill} ${pillMuted} h-10`}
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Buy Me a Coffee */}
                {method === "bmac" && (
                    <div className={`${section} mt-8`}>
                        <h2 className="mb-2 text-lg font-semibold text-slate-900 inline-flex items-center gap-2">
                            <SiBuymeacoffee className={iconCls} /> Buy Me a Coffee
                        </h2>
                        <p className={minor}>Quick small one-time support.</p>
                        <a
                            href={buyMeACoffee || "#"}
                            target="_blank"
                            rel="noreferrer noopener"
                            className={`${pill} ${
                                buyMeACoffee
                                    ? "bg-yellow-300 text-black hover:bg-yellow-200 border border-yellow-300"
                                    : "pointer-events-none border border-gray-200 text-slate-400"
                            } mt-2`}
                        >
                            <SiBuymeacoffee className={iconCls} /> Open Buy Me a Coffee
                        </a>
                        <p className="mt-3 text-xs text-slate-500">Suggested: {finalAmount || "—"}</p>
                    </div>
                )}

                <footer className="mt-10 text-center text-xs text-slate-500">
                    <p>Thank you for your support 💛</p>
                </footer>
            </section>
        </main>
    );
}
