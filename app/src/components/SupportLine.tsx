// Línea de soporte con el WhatsApp del equipo. Se usa al pie de la zona de
// estudiantes (mis cursos, curso y material bloqueado).
export const SUPPORT_WHATSAPP = "+57 323 908 5619";
export const SUPPORT_WHATSAPP_URL = "https://wa.me/573239085619";

export function SupportLine({ note }: { note?: string }) {
  return (
    <div className="flex flex-col gap-2 border border-[#262E31] bg-[#111719] px-5 py-4">
      <p className="font-sans text-[13px] leading-[1.7] text-[#9AA3A1]">
        Gracias por confiar en nosotros. Si necesitas algo,{" "}
        <a
          href={SUPPORT_WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="text-[#B4552B] underline decoration-[#B4552B]/40 underline-offset-4 transition-colors hover:text-[#E2A084]"
        >
          escríbenos por WhatsApp
        </a>{" "}
        al <span className="font-mono text-[12px] text-[#DDE2E0]">{SUPPORT_WHATSAPP}</span>.
      </p>
      {note && (
        <p className="font-mono text-[10px] leading-[1.7] text-[#6C7573]">{note}</p>
      )}
    </div>
  );
}
