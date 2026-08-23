"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumber,
} from "react-phone-number-input";
import defaultFlags from "react-phone-number-input/flags";
import { cn } from "@/lib/utils";

const COUNTRY_CODES = getCountries();
const nameFormatter = new Intl.DisplayNames(["es"], { type: "region" });

function countryName(code: string) {
  return nameFormatter.of(code as any) ?? code;
}

function dialFor(code: string) {
  return String(getCountryCallingCode(code as any));
}

type FlagFn = (props: { title: string; className?: string }) => React.ReactNode;

function Flag({ code, className }: { code: string; className?: string }) {
  const F = (defaultFlags as any)[code] as FlagFn | undefined;
  if (!F) return null;
  return <F title={countryName(code)} className={className} />;
}

function initialFromValue(value: string | undefined): { code: string; national: string } {
  if (!value) return { code: "CO", national: "" };
  try {
    const p = parsePhoneNumber(value);
    if (p?.country && p.nationalNumber != null) {
      return { code: p.country as string, national: String(p.nationalNumber) };
    }
  } catch {
    /* ignore */
  }
  const m = value.match(/^\+(\d+)(.*)$/);
  if (m) {
    const found = COUNTRY_CODES.find((c) => dialFor(c) === m[1]);
    if (found) return { code: found, national: m[2].replace(/\D/g, "") };
  }
  return { code: "CO", national: value.replace(/\D/g, "") };
}

export type PhoneInputProps = {
  value?: string;
  onChange?: (value: string) => void;
  defaultCountry?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export function PhoneInput({
  value,
  onChange,
  defaultCountry = "CO",
  placeholder,
  className,
  disabled,
}: PhoneInputProps) {
  const init = useMemo(() => (value ? initialFromValue(value) : null), [value]);
  const [code, setCode] = useState(init?.code ?? defaultCountry);
  const [national, setNational] = useState(init?.national ?? "");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value === undefined) return;
    const composed = national ? `+${dialFor(code)}${national}` : "";
    if (composed !== value) {
      const next = initialFromValue(value);
      setCode(next.code);
      setNational(next.national);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRY_CODES;
    return COUNTRY_CODES.filter(
      (c) =>
        countryName(c).toLowerCase().includes(q) || dialFor(c).includes(q),
    );
  }, [query]);

  function handleNational(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "");
    setNational(digits);
    onChange?.(digits ? `+${dialFor(code)}${digits}` : "");
  }

  function selectCountry(c: string) {
    setCode(c);
    setOpen(false);
    setQuery("");
    onChange?.(national ? `+${dialFor(c)}${national}` : "");
  }

  return (
    <div
      ref={ref}
      className={cn("relative focus-within:border-[#B4552B] border border-[#262E31] bg-[#0E1214] flex items-stretch", className)}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 border-r border-[#262E31] px-3 py-3 hover:bg-[#111719] disabled:opacity-50"
      >
        <Flag code={code} className="h-[12px] w-auto" />
        <span className="font-mono text-[12px] text-[#9AA3A1]">+{dialFor(code)}</span>
      </button>
      <input
        disabled={disabled}
        value={national}
        onChange={handleNational}
        inputMode="tel"
        placeholder={placeholder}
        className="flex-1 bg-transparent px-4 py-3 font-mono text-[14px] text-[#F1F3F2] outline-none placeholder:text-[#565F62] disabled:opacity-50"
      />

      {open && (
        <div className="absolute left-0 z-50 mt-1 top-full w-[300px] max-h-60 overflow-auto border border-[#262E31] bg-[#111719] shadow-lg">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="buscar país…"
            className="w-full border-b border-[#262E31] bg-[#0E1214] px-3 py-2 font-mono text-[12px] text-[#F1F3F2] outline-none focus:border-[#B4552B] sticky top-0"
          />
          {filtered.length === 0 ? (
            <p className="px-3 py-2 font-mono text-[12px] text-[#565F62]">sin resultados</p>
          ) : (
            filtered.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => selectCountry(c)}
                className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-[#1C2427]"
              >
                <Flag code={c} className="h-[11px] w-auto" />
                <span className="font-mono text-[12px] text-[#F1F3F2]">{countryName(c)}</span>
                <span className="ml-auto font-mono text-[11px] text-[#9AA3A1]">+{dialFor(c)}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
