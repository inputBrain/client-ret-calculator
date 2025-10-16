import React from "react";
import { Banknote } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { type Currency, getCurrencySymbol } from "@/lib/currency";

interface MonobankPaymentProps {
    currency: Currency;
    amount: number | null;
    monoHref: string;
    hasMonoUrl: boolean;
}

const iconCls = "h-4 w-4";

export function MonobankPayment({
    currency,
    amount,
    monoHref,
    hasMonoUrl,
}: MonobankPaymentProps) {
    return (
        <Card>
            <CardHeader
                icon={<Banknote className={iconCls} />}
                title="Donate with Monobank"
                description="Choose amount & currency, then open the public jar."
            />

            <div className="flex flex-wrap items-center gap-3">
                <Button
                    variant={hasMonoUrl ? "primary" : "outline"}
                    size="lg"
                    disabled={!hasMonoUrl}
                    onClick={() => {
                        if (hasMonoUrl) {
                            window.open(monoHref, "_blank", "noopener,noreferrer");
                        }
                    }}
                >
                    <Banknote className={iconCls} />
                    Open Monobank ({currency})
                </Button>

                <span className="text-xs text-slate-600">
          Amount: {amount ?? "—"} {getCurrencySymbol(currency)}
        </span>
            </div>
        </Card>
    );
}