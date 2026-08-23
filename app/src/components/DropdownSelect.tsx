"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDownIcon, SearchIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type DropdownOption = { value: string; label: string };

export type DropdownSelectProps = {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  size?: "default" | "sm";
  searchable?: boolean;
};

export function DropdownSelect({
  options,
  value,
  onChange,
  placeholder,
  className,
  disabled,
  size = "default",
  searchable = false,
}: DropdownSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const filtered = useMemo(() => {
    if (!searchable) return options;
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query, searchable]);

  function pick(o: DropdownOption) {
    onChange?.(o.value);
    setOpen(false);
    setQuery("");
  }

  const triggerClass = cn(
    "flex items-center justify-between gap-2 rounded-none border border-[#262E31] bg-[#0E1214] font-mono text-[#F1F3F2] focus:border-[#B4552B] disabled:cursor-not-allowed disabled:opacity-50",
    size === "default"
      ? "w-full px-4 py-3 text-[14px]"
      : "w-auto px-3 py-1.5 text-[12px]",
    className,
  );

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          setOpen((o) => !o);
          setQuery("");
        }}
        className={triggerClass}
      >
        <span className={cn("truncate", !selected && "text-[#565F62]")}>
          {selected?.label ?? value ?? placeholder}
        </span>
        <ChevronDownIcon className="size-4 shrink-0 text-[#9AA3A1]" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full min-w-36 overflow-hidden border border-[#262E31] bg-[#111719] shadow-lg">
          {searchable && (
            <div className="flex items-center gap-2 border-b border-[#262E31] px-3 py-2">
              <SearchIcon className="size-3.5 text-[#565F62]" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="buscar…"
                className="w-full bg-transparent font-mono text-[12px] text-[#F1F3F2] outline-none placeholder:text-[#565F62]"
              />
            </div>
          )}
          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-3 py-2 font-mono text-[12px] text-[#565F62]">sin resultados</p>
            ) : (
              filtered.map((o) => {
                const active = o.value === value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => pick(o)}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2 text-left font-mono text-[13px]",
                      active
                        ? "bg-[#B4552B] text-[#0E1214]"
                        : "text-[#F1F3F2] hover:bg-[#1C2427]",
                    )}
                  >
                    <span className="flex-1 truncate">{o.label}</span>
                    {active && <CheckIcon className="size-3.5 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
