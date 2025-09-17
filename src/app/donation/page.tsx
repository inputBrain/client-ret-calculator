"use client";
import Image from "next/image";
import {useMemo, useState} from "react";
import {SiBitcoin, SiEthereum, SiTether, SiPaypal, SiBuymeacoffee, SiThirdweb} from "react-icons/si";
import {Banknote} from "lucide-react";

export default function DonatePage() {
    const [method, setMethod] = useState<"crypto" | "uah" | "paypal" | "bmac">("bmac");
    const [amount, setAmount] = useState<number | "">(200);
    const [custom, setCustom] = useState<string>("");

    const preset = [100, 200, 500, 1000];

    const tokens: Array<{
        key: string;
        label: string;
        networks: Array<{ key: string; label: string; envKey: string }>;
    }> = [
        {key: "btc", label: "Bitcoin (BTC)", networks: [{key: "bitcoin", label: "Bitcoin", envKey: "NEXT_PUBLIC_WALLET_BTC"}]},
        {key: "eth", label: "Ethereum (ETH)", networks: [{key: "ethereum", label: "Ethereum", envKey: "NEXT_PUBLIC_WALLET_ETH"}]},
        {
            key: "usdt", label: "Tether (USDT)", networks: [
                {key: "erc20", label: "ERC20 (Ethereum)", envKey: "NEXT_PUBLIC_WALLET_USDT_ETH"},
                {key: "trc20", label: "TRC20 (Tron)", envKey: "NEXT_PUBLIC_WALLET_USDT_TRON"},
            ]
        },
    ];

    const [tokenKey, setTokenKey] = useState(tokens[0].key);
    const activeToken = useMemo(() => tokens.find(t => t.key === tokenKey)!, [tokenKey]);
    const [networkKey, setNetworkKey] = useState(activeToken.networks[0].key);
    const activeNetwork = useMemo(() => activeToken.networks.find(n => n.key === networkKey)!, [activeToken, networkKey]);

    // keep env access exactly as before (dynamic index)
    const address = useMemo(() => (typeof window !== "undefined" ? (process.env[activeNetwork.envKey as any] as string) : "") || "", [activeNetwork.envKey]);
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
            if (amt) {
                const base = paypalMeUrl.endsWith("/") ? paypalMeUrl.slice(0, -1) : paypalMeUrl;
                return `${base}/${amt}${paypalCurrency ? paypalCurrency : ""}`;
            }
            return paypalMeUrl;
        }
        return "";
    }, [paypalDonateUrl, paypalMeUrl, paypalCurrency, finalAmount]);

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

    return (
        <main className="min-h-screen  text-slate-900 ">
            <section className="mx-auto max-w-3xl px-4 py-10">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Support this project</h1>
                    <p className="mt-3 text-slate-600">
                        Choose a method below: Crypto, UAH (monoбанка), PayPal, or Buy Me a Coffee.
                    </p>
                </header>

                <div className="mb-6 grid grid-cols-4 rounded-2xl border border-gray-100 bg-white p-1 backdrop-blur shadow-[0_10px_30px_-1px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.04)]">
                    {[
                        {k: "bmac", l: <span className="inline-flex items-center gap-2"><SiBuymeacoffee className={iconCls}/> Buy Me a Coffee</span>},
                        {k: "paypal", l: <span className="inline-flex items-center gap-2"><SiPaypal className={iconCls}/> PayPal</span>},
                        {k: "uah", l: <span className="inline-flex items-center gap-2"><Banknote className={iconCls}/> UAH (банка)</span>},
                        {k: "crypto", l: <span className="inline-flex items-center gap-2"><SiThirdweb className={iconCls}/> Crypto</span>},

                    ].map((t) => (
                        <button
                            key={t.k}
                            onClick={() => setMethod(t.k as any)}
                            className={`rounded-xl py-2 text-sm sm:text-base font-medium transition border ${
                                method === t.k
                                    ? "bg-indigo-50 text-indigo-800 border-indigo-200"
                                    : "border-transparent text-slate-700 hover:bg-slate-50"
                            }`}
                        >
                            {t.l}
                        </button>
                    ))}
                </div>

                <div className="mb-8 rounded-3xl border border-gray-100 bg-white p-5 sm:p-6 shadow-[0_10px_30px_-1px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.04)]">
                    <h2 className="mb-4 text-lg font-semibold text-slate-900">Amount</h2>
                    <div className="flex flex-wrap gap-2">
                        {preset.map((v) => (
                            <button
                                key={v}
                                onClick={() => {
                                    setAmount(v);
                                    setCustom("");
                                }}
                                className={`rounded-xl px-4 py-2 text-sm font-medium border ${
                                    amount === v && custom === ""
                                        ? "border-indigo-300 bg-indigo-50 text-indigo-800"
                                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
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
                                className="w-28 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-500 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                            />
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
              USD/UAH
            </span>
                        </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">
                        Selected amount: <span className="font-semibold text-slate-900">{finalAmount || "—"}</span>
                    </p>
                </div>

                {method === "crypto" && (
                    <div className="rounded-3xl border border-gray-100 bg-white p-5 sm:p-6 shadow-[0_10px_30px_-1px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.04)]">
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold inline-flex items-center gap-2 text-slate-900">
                                    <SiThirdweb className={iconCls}/> Crypto
                                </h2>
                                <p className="text-sm text-slate-600">Pick a token and network. Addresses are read from env.</p>
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
                                            className={`rounded-xl px-3 py-2 text-sm border inline-flex items-center gap-2 ${
                                                tokenKey === t.key
                                                    ? "border-indigo-300 bg-indigo-50 text-indigo-800"
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
                                            className={`rounded-xl px-3 py-2 text-sm border inline-flex items-center gap-2 ${
                                                networkKey === n.key
                                                    ? "border-indigo-300 bg-indigo-50 text-indigo-800"
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
                                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                    >
                                        Copy
                                    </button>
                                </div>
                                <p className="mt-2 text-xs text-slate-500">Always double-check the network before sending.</p>
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
                            <Banknote className={iconCls}/> Donate in UAH
                        </h2>
                        <p className="mb-4 text-sm text-slate-600">Redirect to monoбанка (public jar).</p>
                        <div className="flex flex-wrap items-center gap-3">
                            <a
                                href={monobankJar || "#"}
                                target="_blank"
                                rel="noreferrer noopener"
                                className={`rounded-xl px-5 py-3 text-sm font-medium shadow-sm transition ${
                                    monobankJar ? "bg-emerald-500 text-white hover:bg-emerald-600" : "pointer-events-none bg-slate-200 text-slate-400"
                                }`}
                            >
                                Open monoбанка
                            </a>
                            <span className="text-xs text-slate-600">Amount: {finalAmount || "—"}</span>
                        </div>
                        <p className="mt-3 text-xs text-slate-500">For precise amounts, you can specify it after opening the jar.</p>
                    </div>
                )}

                {method === "paypal" && (
                    <div className="rounded-3xl border border-gray-100 bg-white p-5 sm:p-6 shadow-[0_10px_30px_-1px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.04)]">
                        <h2 className="mb-2 text-lg font-semibold inline-flex items-center gap-2 text-slate-900">
                            <SiPaypal className={iconCls}/> PayPal
                        </h2>
                        <p className="mb-4 text-sm text-slate-600">Use PayPal Donate or PayPal.me.</p>
                        <div className="flex flex-wrap items-center gap-3">
                            <a
                                href={paypalUrl || "#"}
                                target="_blank"
                                rel="noreferrer noopener"
                                className={`rounded-xl px-5 py-3 text-sm font-medium shadow-sm transition inline-flex items-center gap-2 ${
                                    paypalUrl ? "bg-sky-500 text-white hover:bg-sky-600" : "pointer-events-none bg-slate-200 text-slate-400"
                                }`}
                            >
                                <SiPaypal className={iconCls}/> Open PayPal
                            </a>
                            <span className="text-xs text-slate-600">Suggested: {finalAmount || "—"} {paypalCurrency}</span>
                        </div>
                        <div className="mt-5">
                            <label className="mb-1 block text-sm text-slate-700">PayPal email</label>
                            <div className="flex items-center gap-2">
                                <input
                                    readOnly
                                    value={paypalEmail}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
                                />
                                <button
                                    onClick={() => paypalEmail && navigator.clipboard.writeText(paypalEmail)}
                                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
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
                        <p className="mb-4 text-sm text-slate-600">Quick small one-time support.</p>
                        <a
                            href={buyMeACoffee || "#"}
                            target="_blank"
                            rel="noreferrer noopener"
                            className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium shadow-sm transition ${
                                buyMeACoffee ? "bg-yellow-400 text-black hover:bg-yellow-300" : "pointer-events-none bg-slate-200 text-slate-400"
                            }`}
                        >
                            <SiBuymeacoffee className={iconCls}/> Open Buy Me a Coffee
                        </a>
                        <p className="mt-3 text-xs text-slate-600">Suggested: {finalAmount || "—"}</p>
                    </div>
                )}

                <footer className="mt-10 text-center text-xs text-slate-500">
                    <p>Thank you for your support 💛</p>
                </footer>
            </section>
        </main>
    );

}
