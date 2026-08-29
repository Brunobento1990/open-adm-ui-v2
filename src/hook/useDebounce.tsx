import { useEffect, useState } from 'react';

export function useDebounce<T>(valor: T, delay = 300): T {
    const [valorComDebounce, setValorComDebounce] = useState<T>(valor);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setValorComDebounce(valor);
        }, delay);

        return () => clearTimeout(timeout);
    }, [valor, delay]);

    return valorComDebounce;
}