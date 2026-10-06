"use client";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { DELETE_COURSE_CONFIRM } from "../../convex/cloneCourse";

type Props = {
  course: { _id: Id<"courses">; title: string; slug: string } | null;
  onClose: () => void;
};

// Se monta con `key` = id del curso, así el texto escrito se reinicia solo.
// Modal estilo GitHub: el botón queda bloqueado hasta escribir el texto exacto.
export function DeleteCourseDialog({ course, onClose }: Props) {
  const preview = useQuery(api.admin.deleteCoursePreview, course ? { courseId: course._id } : "skip");
  const deleteCourse = useMutation(api.admin.deleteCourse);
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!course) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !busy && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [course, busy, onClose]);

  if (!course) return null;

  const blocked = preview?.blocked === true;
  const matches = typed === DELETE_COURSE_CONFIRM;

  async function submit() {
    if (!course || !matches || blocked) return;
    setBusy(true);
    setError(null);
    try {
      await deleteCourse({ courseId: course._id, confirm: typed });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "error");
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0E1214]/70 p-4"
      onClick={() => !busy && onClose()}
    >
      <div
        role="dialog"
        aria-label="Eliminar curso"
        className="w-full max-w-[460px] border border-[#262E31] bg-[#111719] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-sans text-[20px] font-light text-[#F1F3F2]">Eliminar curso</h3>
        <p className="mt-2 font-mono text-[12px] leading-[1.7] text-[#9AA3A1]">
          {course.title} <span className="text-[#B4552B]">[{course.slug}]</span>
        </p>

        {preview === undefined ? (
          <p className="mt-4 font-mono text-[11px] text-[#6C7573]">cargando…</p>
        ) : preview === null ? null : blocked ? (
          <p className="mt-4 border border-[#3A1C0C] bg-[#1C2427] px-3 py-2 font-mono text-[11px] leading-[1.7] text-[#E2A084]">
            {"// "}No se puede eliminar: tiene {preview.blockers.registrations} inscritos,{" "}
            {preview.blockers.invites} invitaciones y {preview.blockers.responses} respuestas de
            encuesta.
          </p>
        ) : (
          <>
            <p className="mt-4 font-mono text-[12px] leading-[1.7] text-[#9AA3A1]">
              Se borrarán {preview.sections} secciones · {preview.items} ítems · {preview.profiles}{" "}
              perfiles · {preview.files} archivos, junto con sus archivos de storage. No se puede
              deshacer.
            </p>
            <label className="mt-4 block font-mono text-[11px] text-[#9AA3A1]">
              Escribe <strong className="text-[#F1F3F2]">{DELETE_COURSE_CONFIRM}</strong> para
              confirmar
              <input
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                className="mt-2 w-full border border-[#262E31] bg-[#0E1214] px-3 py-2 font-mono text-[12px] text-[#F1F3F2] outline-none focus:border-[#B4552B]"
              />
            </label>
          </>
        )}

        {error && (
          <p className="mt-3 border border-[#3A1C0C] bg-[#1C2427] px-3 py-2 font-mono text-[11px] text-[#E2A084]">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="border border-[#262E31] px-4 py-2 font-mono text-[11px] tracking-[0.08em] uppercase text-[#9AA3A1] hover:text-[#F1F3F2]"
          >
            cancelar
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!matches || blocked || busy || !preview}
            className="bg-[#5D2F2F] px-4 py-2 font-mono text-[11px] tracking-[0.08em] uppercase text-[#F1F3F2] hover:bg-[#6d3a3a] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? "eliminando…" : "eliminar este curso"}
          </button>
        </div>
      </div>
    </div>
  );
}
