export default function SignInPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#B4552B]">Acceso</span>
      <h1 className="mt-3 font-sans text-[32px] font-light tracking-[-0.02em] text-[#F1F3F2]">Ingresar</h1>
      <p className="mt-2 font-sans text-[14px] leading-[1.6] text-[#9AA3A1]">Autenticación vía Convex Auth (Password provider). Configura CONVEX_DEPLOYMENT para habilitar.</p>
      <div className="mt-6 border border-[#262E31] bg-[#1C2427] p-6 font-mono text-[12px] leading-[1.7] text-[#6C7573]">
        {"// Formulario de login pendiente de conexión Convex."}
        <div className="mt-3 h-[1.5px] w-10 bg-[#B4552B]"></div>
      </div>
    </div>
  );
}
