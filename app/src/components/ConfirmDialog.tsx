"use client";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "confirmar",
  cancelLabel = "cancelar",
  danger,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0E1214]/70 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] border border-[#262E31] bg-[#111719] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-sans text-[20px] font-light text-[#F1F3F2]">{title}</h3>
        {description && (
          <p className="mt-2 font-mono text-[12px] leading-[1.7] text-[#9AA3A1]">{description}</p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="border border-[#262E31] px-4 py-2 font-mono text-[11px] tracking-[0.08em] uppercase text-[#9AA3A1] hover:text-[#F1F3F2]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              "px-4 py-2 font-mono text-[11px] tracking-[0.08em] uppercase",
              danger
                ? "bg-[#5D2F2F] text-[#F1F3F2] hover:bg-[#6d3a3a]"
                : "bg-[#B4552B] text-[#0E1214] hover:bg-[#9A4A24]",
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
