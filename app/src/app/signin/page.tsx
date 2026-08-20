export default function SignInPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-fraunces)" }}>Ingresar</h1>
      <p className="mt-2 text-sm text-[#4e5b53]">Autenticación vía Convex Auth (Password provider). Configura CONVEX_DEPLOYMENT para habilitar.</p>
      <div className="mt-6 rounded-xl border bg-[#fffdf8] p-6 text-sm text-[#6f7d74]">Formulario de login pendiente de conexión Convex.</div>
    </div>
  );
}
