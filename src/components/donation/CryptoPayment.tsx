import React, {useState, useMemo} from "react";
import Image from "next/image";
import {SiBitcoin, SiEthereum, SiTether} from "react-icons/si";
import {Card, CardHeader} from "@/components/ui/Card";
import {Button} from "@/components/ui/Button";
import {Copy, Check} from "lucide-react";
import {toast} from "react-toastify";
import {getCryptoAddress} from "@/lib/donation-constants";

// ✅ Список всіх крипто варіантів (один варіант = одна адреса)
const CRYPTO_OPTIONS = [
    {
        id: "btc",
        name: "Bitcoin",
        symbol: "BTC",
        network: "Bitcoin Network",
        icon: <SiBitcoin className="h-8 w-8"/>,
        color: "from-orange-400 to-orange-600",
        envKey: "NEXT_PUBLIC_WALLET_BTC",
    },
    {
        id: "eth",
        name: "Ethereum",
        symbol: "ETH",
        network: "Ethereum Network",
        icon: <SiEthereum className="h-8 w-8"/>,
        color: "from-blue-400 to-indigo-600",
        envKey: "NEXT_PUBLIC_WALLET_ETH",
    },
    {
        id: "usdt-erc20",
        name: "Tether",
        symbol: "USDT",
        network: "ERC-20 (Ethereum)",
        icon: <SiTether className="h-8 w-8"/>,
        color: "from-green-400 to-emerald-600",
        envKey: "NEXT_PUBLIC_WALLET_USDT_ETH",
    },
    {
        id: "usdt-trc20",
        name: "Tether",
        symbol: "USDT",
        network: "TRC-20 (Tron)",
        icon: (
            <div className="relative h-8 w-8">
                <Image
                    src="/crypto-icons/tron-trx-logo.png"
                    alt="TRON"
                    width={32}
                    height={32}
                    className="h-8 w-8"
                />
            </div>
        ),
        color: "from-red-400 to-rose-600",
        envKey: "NEXT_PUBLIC_WALLET_USDT_TRON",
    },
] as const;

interface CryptoPaymentProps {
    // Більше не потрібні складні props!
}

export function CryptoPayment({}: CryptoPaymentProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    // ✅ Обраний варіант
    const selected = useMemo(
        () => CRYPTO_OPTIONS.find((opt) => opt.id === selectedId) || null,
        [selectedId]
    );

    // ✅ Адреса гаманця
    const address = useMemo(() => {
        if (!selected) return "";
        return getCryptoAddress(selected.envKey);
    }, [selected]);

    // ✅ QR код
    const qrUrl = useMemo(() => {
        if (!address) return "";
        const payload = encodeURIComponent(address);
        return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${payload}`;
    }, [address]);

    // ✅ Копіювання адреси
    const handleCopy = async () => {
        if (!address) return;
        try {
            await navigator.clipboard.writeText(address);
            setCopied(true);
            toast.success("Address copied!");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to copy");
        }
    };

    return (
        <Card>
            <CardHeader
                title="Crypto Donation"
                description="Select a cryptocurrency to see the wallet address and QR code."
            />

            {/* ✅ Вибір криптовалюти (великі картки) */}
            {!selected ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {CRYPTO_OPTIONS.map((option) => {
                        const hasAddress = !!getCryptoAddress(option.envKey);

                        return (
                            <button
                                key={option.id}
                                onClick={() => hasAddress && setSelectedId(option.id)}
                                disabled={!hasAddress}
                                className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all ${
                                    hasAddress
                                        ? "hover:scale-[1.02] hover:shadow-xl cursor-pointer"
                                        : "opacity-50 cursor-not-allowed"
                                }`}
                            >
                                {/* Gradient background */}
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-10 group-hover:opacity-20 transition-opacity`}
                                />

                                {/* Content */}
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="text-slate-700 group-hover:scale-110 transition-transform">
                                            {option.icon}
                                        </div>
                                        {hasAddress && (
                                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        Available
                      </span>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                                        {option.name}
                                    </h3>
                                    <p className="text-sm font-medium text-slate-600 mb-2">
                                        {option.symbol}
                                    </p>
                                    <p className="text-xs text-slate-500">{option.network}</p>

                                    {!hasAddress && (
                                        <p className="text-xs text-red-600 mt-2">
                                            Wallet not configured
                                        </p>
                                    )}
                                </div>

                                {/* Arrow indicator */}
                                {hasAddress && (
                                    <div className="absolute bottom-4 right-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all">
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            ) : (
                <>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="text-slate-700">{selected.icon}</div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">
                                        {selected.name} ({selected.symbol})
                                    </h3>
                                    <p className="text-sm text-slate-600">{selected.network}</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedId(null)}
                            >
                                ← Change
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Address */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Wallet Address
                                </label>
                                <div className="space-y-3">
                                    <div className="relative">
                                        <input
                                            readOnly
                                            value={address}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 font-mono outline-none"
                                        />
                                        <button
                                            onClick={handleCopy}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition"
                                        >
                                            {copied ? (
                                                <Check className="h-4 w-4 text-green-600"/>
                                            ) : (
                                                <Copy className="h-4 w-4"/>
                                            )}
                                        </button>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="md"
                                        onClick={handleCopy}
                                        className="w-full"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="h-4 w-4"/>
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-4 w-4"/>
                                                Copy Address
                                            </>
                                        )}
                                    </Button>
                                </div>

                                <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
                                    <p className="text-sm text-blue-800 mb-2">
                                        💡 <strong>How to donate:</strong>
                                    </p>
                                    <ol className="text-xs text-blue-700 space-y-1 ml-4 list-decimal">
                                        <li>Copy the address above or scan the QR code</li>
                                        <li>Open your crypto wallet app</li>
                                        <li>Send <strong>any amount</strong> of {selected.symbol} you want</li>
                                        <li>Make sure to select <strong>{selected.network}</strong></li>
                                    </ol>
                                </div>

                                <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200">
                                    <p className="text-xs text-amber-800">
                                        ⚠️ <strong>Important:</strong> Only send <strong>{selected.symbol}</strong> via{" "}
                                        <strong>{selected.network}</strong>. Sending via a different
                                        network will result in permanent loss of funds.
                                    </p>
                                </div>
                            </div>

                            {/* QR Code */}
                            <div className="flex flex-col items-center justify-center">
                                {address ? (
                                    <div className="space-y-3">
                                        <img
                                            src={qrUrl}
                                            alt="Wallet QR Code"
                                            className="w-64 h-64 rounded-2xl border-2 border-slate-200 bg-white p-3 shadow-lg"
                                        />
                                        <p className="text-xs text-center text-slate-500">
                                            Scan with your crypto wallet
                                        </p>
                                    </div>
                                ) : (
                                    <div className="w-64 h-64 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center">
                                        <p className="text-slate-500 text-sm text-center px-4">
                                            Wallet address not configured
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </Card>
    );
}