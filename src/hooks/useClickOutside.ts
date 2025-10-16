import { useEffect, useRef } from "react";

/**
 * Hook для обробки кліків поза елементом
 * Використовується для закриття дропдаунів, модалок тощо
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
    handler: () => void,
    enabled: boolean = true
) {
    const ref = useRef<T>(null);

    useEffect(() => {
        if (!enabled) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                handler();
            }
        };

        const timer = setTimeout(() => {
            document.addEventListener("mousedown", handleClickOutside);
        }, 0);

        return () => {
            clearTimeout(timer);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handler, enabled]);

    return ref;
}