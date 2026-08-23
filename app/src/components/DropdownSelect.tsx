"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
};

export function DropdownSelect({
  options,
  value,
  onChange,
  placeholder,
  className,
  disabled,
  size = "default",
}: DropdownSelectProps) {
  return (
    <Select
      value={value || null}
      onValueChange={(v) => onChange?.((v as string) || "")}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn(
          "rounded-none border border-[#262E31] bg-[#0E1214] font-mono text-[14px] text-[#F1F3F2] h-auto data-placeholder:text-[#565F62] focus:border-[#B4552B]",
          size === "default" ? "w-full px-4 py-3" : "w-auto px-3 py-1.5 text-[12px]",
          className,
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="rounded-none border border-[#262E31] bg-[#111719] text-[#F1F3F2]">
        {options.map((o) => (
          <SelectItem
            key={o.value}
            value={o.value}
            className="font-mono text-[13px] text-[#F1F3F2] data-[highlighted]:bg-[#B4552B] data-[highlighted]:text-[#0E1214]"
          >
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
