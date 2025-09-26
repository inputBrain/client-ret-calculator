// export function currencyFormat(value: number, currency: "EUR" | "USD" | "GBP") {
//     try {
//         return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(value);
//     } catch {
//         const symbols: Record<string, string> = { EUR: "€", USD: "$", GBP: "£" };
//         return `${symbols[currency] ?? ""}${value.toFixed(2)}`;
//     }
// }
