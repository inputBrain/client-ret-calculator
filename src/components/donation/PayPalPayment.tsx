import React from "react";
import { SiPaypal } from "react-icons/si";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { toast } from "react-toastify";

interface PayPalPaymentProps {
    currency: string;
    amount: number | null;
    paypalUrl: string;
    paypalEmail: string;
}

const iconCls = "h-4 w-4";

export function PayPalPayment({
    currency,
    amount,
    paypalUrl,
    paypalEmail,
}: PayPalPaymentProps) {

    // ✅ Копіювання email
    const handleCopyEmail = async () => {
        if (!paypalEmail) return;
        try {
            await navigator.clipboard.writeText(paypalEmail);
            toast.success("Email copied!");
        } catch {
            toast.error("Only available in secure contexts");
        }
    };

    return (
        <Card>
            <CardHeader
                icon={<SiPaypal className={iconCls} />}
                title="PayPal"
                description="Use PayPal Donate or PayPal.me."
            />

            {/* ✅ Кнопка відкрити PayPal */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
                <Button
                    variant="paypal"
                    size="lg"
                    disabled={!paypalUrl}
                    onClick={() => {
                        if (paypalUrl) {
                            window.open(paypalUrl, "_blank", "noopener,noreferrer");
                        }
                    }}
                >
                    <SiPaypal className={iconCls} />
                    Open PayPal
                </Button>

                <span className="text-xs text-slate-600">
          Suggested: {amount ?? "—"} {currency}
        </span>
            </div>

            {/* ✅ PayPal Email */}
            <div>
                <label className="mb-1 block text-sm text-slate-700">
                    PayPal email
                </label>
                <div className="flex items-center gap-2">
                    <input
                        readOnly
                        value={paypalEmail}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
                    />
                    <Button
                        variant="outline"
                        size="md"
                        onClick={handleCopyEmail}
                        disabled={!paypalEmail}
                    >
                        Copy
                    </Button>
                </div>
            </div>
        </Card>
    );
}