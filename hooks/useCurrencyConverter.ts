"use client";

import { useState, useEffect, useCallback } from "react";

export type CurrencyRates = Record<string, number>;

export function useCurrencyConverter() {
  const [currency, setCurrency] = useState<string>("IDR");
  const [rates, setRates] = useState<CurrencyRates>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // We will derive availableCurrencies from the rates object so it's unlimited

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        // 1. Fetch rates from IDR
        const rateRes = await fetch("https://api.exchangerate-api.com/v4/latest/IDR");
        if (!rateRes.ok) throw new Error("Failed to fetch rates");
        const rateData = await rateRes.json();
        
        if (mounted) {
          setRates(rateData.rates);
        }

        // 2. Detect or load currency
        const saved = localStorage.getItem("lombok_preferred_currency");
        if (saved && rateData.rates[saved]) {
          if (mounted) setCurrency(saved);
        } else {
          // Attempt IP detection
          try {
            const ipRes = await fetch("https://ipapi.co/json/");
            if (ipRes.ok) {
              const ipData = await ipRes.json();
              if (ipData.currency && rateData.rates[ipData.currency]) {
                if (mounted) {
                  setCurrency(ipData.currency);
                  localStorage.setItem("lombok_preferred_currency", ipData.currency);
                }
              }
            }
          } catch (e) {
            console.error("IP detection failed, defaulting to IDR", e);
          }
        }
      } catch (error) {
        console.error("Currency init error:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSetCurrency = (code: string) => {
    setCurrency(code);
    localStorage.setItem("lombok_preferred_currency", code);
  };

  const formatPrice = useCallback((amountInIdr: number, showApprox: boolean = false) => {
    if (currency === "IDR" || !rates[currency]) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(amountInIdr);
    }

    const converted = amountInIdr * rates[currency];
    
    // Add an approx symbol (≈) when it's not IDR to signify it's converted
    const formatted = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(converted);

    return showApprox ? `≈ ${formatted}` : formatted;
  }, [currency, rates]);

  const availableCurrencies = Object.keys(rates).sort();

  return {
    currency,
    setCurrency: handleSetCurrency,
    formatPrice,
    availableCurrencies,
    isLoading,
    rates
  };
}
