import React, { useMemo } from "react";
import Image from "next/image";
import { SiBitcoin, SiEthereum, SiTether, SiThirdweb } from "react-icons/si";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { tokens } from "@/lib/donation-helper";
import { toast } from "react-toastify";

interface CryptoPaymentProps {
    tokenKey: string;
    onTokenChange: (key: string) => void;
    networkKey: string;
    onNetworkChange: (key: string) => void;
    activeToken: typeof tokens[number];
    activeNetwork: typeof tokens[number]["networks"][number];
    address: string;
    qrUrl: string;
}

const iconCls = "h-4 w-4";

// ✅ Іконки для токенів
const tokenIcon = (key: string) => {
    if (key === "btc") return <SiBitcoin className={iconCls} />;
    if (key === "eth") return <SiEthereum className={iconCls} />;
    return <SiTether className={iconCls} />;
};

// ✅ Іконки для мереж
const networkIcon = (key: string) => {
    if (key === "bitcoin") return <SiBitcoin className={iconCls} />;
    if (key === "ethereum" || key === "erc20") return <SiEthereum className={iconCls} />;
    if (key === "tron" || key === "trc20") {
        return (
            <Image
                src="/crypto-icons/tron-trx-logo.png"
                alt="TRON"
                width={16}
                height={16}
                className={iconCls}
            />
        );
    }
    return null;
};

export function CryptoPayment({
    tokenKey,
    onTokenChange,
    networkKey,
    onNetworkChange,
    activeToken,
    activeNetwork,
    address,
    qrUrl,
}: CryptoPaymentProps) {

    // ✅ Копіювання адреси
    const handleCopy = async () => {
        if (!address) return;
        try {
            await navigator.clipboard.writeText(address);
            toast.success("Address copied!");
        } catch {
            toast.error("Failed to copy");
        }
    };

    return (
        <Card>
            <CardHeader
                icon={<SiThirdweb className={iconCls} />}
                title="Crypto"
                description="Pick a token and network. Addresses are read from env."
            />

            {/* ✅ Token та Network селектори */}
            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Token */}
                <div>
                    <label className="mb-1 block text-sm text-slate-700">Token</label>
                    <div className="flex flex-wrap gap-2">
                        {tokens.map((token) => (
                            <Button
                                key={token.key}
                                variant="outline"
                                size="md"
                                isActive={tokenKey === token.key}
                                onClick={() => onTokenChange(token.key)}
                            >
                                {tokenIcon(token.key)}
                                {token.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Network */}
                <div>
                    <label className="mb-1 block text-sm text-slate-700">Network</label>
                    <div className="flex flex-wrap gap-2">
                        {activeToken.networks.map((network) => (
                            <Button
                                key={network.key}
                                variant="outline"
                                size="md"
                                isActive={networkKey === network.key}
                                onClick={() => onNetworkChange(network.key)}
                            >
                                {networkIcon(network.key)}
                                {network.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ✅ Address та QR код */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Address */}
                <div>
                    <label className="mb-2 block text-sm text-slate-700">Address</label>
                    <div className="flex items-center gap-2">
                        <input
                            readOnly
                            value={address}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
                        />
                        <Button
                            variant="outline"
                            size="md"
                            onClick={handleCopy}
                            disabled={!address}
                        >
                            Copy
                        </Button>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                        Always double-check the network before sending.
                    </p>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center justify-center">
                    {address ? (
                        <img
                            src={qrUrl}
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
        </Card>
    );
}