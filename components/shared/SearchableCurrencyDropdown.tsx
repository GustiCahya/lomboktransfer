"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  currency: string;
  setCurrency: (c: string) => void;
  availableCurrencies: string[];
  disabled?: boolean;
}

export default function SearchableCurrencyDropdown({ currency, setCurrency, availableCurrencies, disabled }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = availableCurrencies.filter(c => c.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "flex items-center gap-2 bg-background border rounded-full px-4 py-2 shadow-sm text-sm font-semibold text-foreground transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed",
          isOpen && "ring-2 ring-primary/20"
        )}
      >
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Curr:</span>
        {currency}
        <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 border-b">
            <div className="flex items-center px-3 py-2 bg-muted/50 rounded-md">
              <Search className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
              <input 
                type="text"
                placeholder="Search currency (e.g. CNY, EUR)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none text-sm w-full focus:outline-none placeholder:text-muted-foreground"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-[300px] overflow-y-auto p-1 custom-scrollbar">
            {filtered.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">No currencies found.</div>
            ) : (
              filtered.map(c => (
                <button
                  key={c}
                  onClick={() => {
                    setCurrency(c);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={cn(
                    "w-full text-left flex items-center justify-between px-3 py-2.5 text-sm rounded-md transition-colors hover:bg-muted/50 focus:outline-none focus:bg-muted/50",
                    currency === c ? "bg-primary/10 text-primary font-semibold" : "text-foreground"
                  )}
                >
                  {c}
                  {currency === c && <Check className="h-4 w-4" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
