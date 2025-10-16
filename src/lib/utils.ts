import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Об'єднує класи Tailwind без конфліктів
 * Використовує clsx для умовних класів та twMerge для правильного мерджу
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Форматує число як валюту
 */
export function formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
}

/**
 * Парсить рядок в число (для інпутів)
 */
export function parseAmount(value: string): number | null {
    const cleaned = value.replace(/[^\d.,]/g, "").replace(",", ".");
    const num = parseFloat(cleaned);
    return Number.isFinite(num) && num > 0 ? num : null;
}