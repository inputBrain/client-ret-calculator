import React from "react";
import { SiBuymeacoffee } from "react-icons/si";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface BuyMeACoffeePaymentProps {
    bmacUrl: string;
    amount: number | null;
}

const iconCls = "h-4 w-4";

export function BuyMeACoffeePayment({
    bmacUrl,
    amount,
}: BuyMeACoffeePaymentProps) {
    return (
        <Card>
            <CardHeader
                icon={<SiBuymeacoffee className={iconCls} />}
                title="Buy Me a Coffee"
                description="Quick small one-time support."
            />

            <Button
                variant="bmac"
                size="lg"
                disabled={!bmacUrl}
                onClick={() => {
                    if (bmacUrl) {
                        window.open(bmacUrl, "_blank", "noopener,noreferrer");
                    }
                }}
            >
                <SiBuymeacoffee className={iconCls} />
                Open Buy Me a Coffee
            </Button>

            <p className="mt-3 text-xs text-slate-600">
                Suggested: {amount || "—"}
            </p>
        </Card>
    );
}