import { useEffect } from "react";

/**
 * Fetch data from the given URL at a regular interval.
 * @param url - The URL to fetch data from.
 * @param refreshInterval - The interval at which to fetch data.
 * @param ceaseOnError - Whether to stop polling on error.
 * @param fetchTimeout - The timeout for the fetch request.
 * @param callback - The callback function to call on success.
 * @param onError - The callback function to call on error.
 */
export default function usePolling(options: {
    url: string;
    refreshInterval: number;
    ceaseOnError?: boolean;
    fetchTimeout?: number;
    retryCount?: number;
    callback?: (data: any) => void;
    onError?: (error: any) => void;
}): void {
    const {
        url,
        refreshInterval = 1000 * 60 * 60,
        ceaseOnError = true,
        fetchTimeout = 5000,
        retryCount = 0,
        callback,
        onError,
    } = options;

    useEffect(() => {
        let isMounted = true;
        let timeoutId: NodeJS.Timeout;

        const fetchData = async (attemptNumber = 0) => {
            const controller = new AbortController();
            const { signal } = controller;
            const fetchTimeoutId = setTimeout(() => {
                controller.abort();
                console.error("Fetch request timed out");
            }, fetchTimeout);
            try {
                const response = await fetch(url, { signal });
                const data = await response.json();
                if (isMounted) {
                    callback?.(data);
                }
            } catch (error) {
                if (attemptNumber < retryCount) {
                    console.error(`Error fetching data: ${error}`);
                    fetchData(attemptNumber + 1);
                    return;
                } else {
                    onError?.(error);
                    if (ceaseOnError) {
                        return;
                    }
                }
            } finally {
                clearTimeout(fetchTimeoutId);
            }
            if (isMounted) {
                timeoutId = setTimeout(fetchData, refreshInterval);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, [url, refreshInterval]);
}
