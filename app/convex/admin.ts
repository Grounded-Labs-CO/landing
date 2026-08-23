// @ts-nocheck
import { action, mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

async function requireActiveAdmin(ctx) {
  const callerId = await getAuthUserId(ctx);
  if (!callerId) throw new Error("No autenticado");
  const callerRole = await ctx.db
    .query("user_roles")
    .withIndex("by_userId", (q) => q.eq("userId", callerId))
    .unique();
  if (!callerRole || callerRole.role !== "admin" || callerRole.status !== "active") {
    throw new Error("No autorizado");
  }
  return callerId;
}

// BORRADO EN CASCADA (hard delete) de una cuenta y todo lo relacionado.
// Solo para pruebas/operación: elimina de la BD todas las entidades del user.
export const deleteUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const callerId = await requireActiveAdmin(ctx);
    if (callerId === args.userId) throw new Error("No puedes borrar tu propia cuenta");
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("Usuario no encontrado");
    const email = (user as any)?.email?.toLowerCase();

    let deleted = 0;

    // authVerificationCodes + authAccounts (por userId)
    const accounts = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) => q.eq("userId", args.userId))
      .collect();
    for (const account of accounts) {
      const codes = await ctx.db
        .query("authVerificationCodes")
        .withIndex("accountId", (q) => q.eq("accountId", account._id))
        .collect();
      for (const code of codes) {
        await ctx.db.delete(code._id);
        deleted++;
      }
      await ctx.db.delete(account._id);
      deleted++;
    }

    // authRefreshTokens + authVerifiers + authSessions (por userId)
    const sessions = await ctx.db
      .query("authSessions")
      .withIndex("userId", (q) => q.eq("userId", args.userId))
      .collect();
    const sessionIds = new Set(sessions.map((s) => s._id));
    for (const session of sessions) {
      const tokens = await ctx.db
        .query("authRefreshTokens")
        .withIndex("sessionId", (q) => q.eq("sessionId", session._id))
        .collect();
      for (const token of tokens) {
        await ctx.db.delete(token._id);
        deleted++;
      }
      await ctx.db.delete(session._id);
      deleted++;
    }
    const verifiers = await ctx.db.query("authVerifiers").collect();
    for (const verifier of verifiers) {
      if (verifier.sessionId && sessionIds.has(verifier.sessionId)) {
        await ctx.db.delete(verifier._id);
        deleted++;
      }
    }

    if (email) {
      // authRateLimits + leads (por email)
      const limits = await ctx.db
        .query("authRateLimits")
        .withIndex("identifier", (q) => q.eq("identifier", email))
        .collect();
      for (const limit of limits) {
        await ctx.db.delete(limit._id);
        deleted++;
      }
      const leads = await ctx.db
        .query("leads")
        .withIndex("by_email", (q) => q.eq("email", email))
        .collect();
      for (const lead of leads) {
        await ctx.db.delete(lead._id);
        deleted++;
      }
      // workshop_registrations: solo si nadie más comparte este email. Si hay
      // usuarios duplicados, borrar un usuario no debe quitarle el curso al otro.
      const others = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), email))
        .collect();
      const emailShared = others.some((u) => u._id !== args.userId);
      if (!emailShared) {
        const registrations = await ctx.db
          .query("workshop_registrations")
          .withIndex("by_email", (q) => q.eq("email", email))
          .collect();
        for (const registration of registrations) {
          await ctx.db.delete(registration._id);
          deleted++;
        }
      }
    }

    const role = await ctx.db
      .query("user_roles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    if (role) {
      await ctx.db.delete(role._id);
      deleted++;
    }
    const profile = await ctx.db
      .query("user_profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    if (profile) {
      await ctx.db.delete(profile._id);
      deleted++;
    }

    // Por último, el user
    await ctx.db.delete(args.userId);
    deleted++;

    return { deleted };
  },
});

// Bootstrap del primer admin: se llama desde la CLI (npx convex run) con el
// secreto configurado en el deployment (npx convex env set ADMIN_BOOTSTRAP_SECRET ...).
export const promoteByEmail = mutation({
  args: { email: v.string(), secret: v.string(), role: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const expected = process.env.ADMIN_BOOTSTRAP_SECRET;
    if (!expected) {
      throw new Error("ADMIN_BOOTSTRAP_SECRET no configurado en el deployment");
    }
    if (args.secret !== expected) {
      throw new Error("Secreto inválido");
    }
    const email = args.email.toLowerCase();
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), email))
      .unique();
    if (!user) throw new Error(`No existe usuario con email ${email}`);
    const role = args.role === "admin" ? "admin" : "viewer";
    const existing = await ctx.db
      .query("user_roles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { role, status: "active" });
      return existing._id;
    }
    return await ctx.db.insert("user_roles", {
      userId: user._id,
      role,
      status: "active",
    });
  },
});

export const markRegistrationPaid = mutation({
  args: { email: v.string(), workshopSlug: v.string() },
  handler: async (ctx, args) => {
    await requireActiveAdmin(ctx);
    const email = args.email.toLowerCase();
    const registration = await ctx.db
      .query("workshop_registrations")
      .withIndex("by_email", (q) => q.eq("email", email))
      .filter((q) => q.eq(q.field("workshopSlug"), args.workshopSlug))
      .unique();
    if (!registration) {
      throw new Error(`No existe registro de ${email} en ${args.workshopSlug}`);
    }
    await ctx.db.patch(registration._id, { status: "paid" });
    return registration._id;
  },
});

async function isActiveAdmin(ctx) {
  const callerId = await getAuthUserId(ctx);
  if (!callerId) return false;
  const callerRole = await ctx.db
    .query("user_roles")
    .withIndex("by_userId", (q) => q.eq("userId", callerId))
    .unique();
  return !!callerRole && callerRole.role === "admin" && callerRole.status === "active";
}

export const listRegistrations = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isActiveAdmin(ctx))) return [];
    const registrations = await ctx.db.query("workshop_registrations").collect();
    return registrations.sort((a, b) => a.createdAt - b.createdAt);
  },
});

// Crear estudiante sin pago (para pruebas) — usa bootstrap secret.
// NO pre-crea user/user_roles: el usuario nace en su primer sign-in (magic link);
// pre-crearlo genera un usuario duplicado al autenticar.
export const addStudent = mutation({
  args: { email: v.string(), secret: v.string(), name: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const expected = process.env.ADMIN_BOOTSTRAP_SECRET;
    if (!expected || args.secret !== expected) throw new Error("Secreto inválido");
    const email = args.email.toLowerCase();
    const existingReg = await ctx.db
      .query("workshop_registrations")
      .withIndex("by_email", (q) => q.eq("email", email))
      .filter((q) => q.eq(q.field("workshopSlug"), "finanzas-personales-ia"))
      .unique();
    if (!existingReg) {
      return await ctx.db.insert("workshop_registrations", {
        email,
        workshopSlug: "finanzas-personales-ia",
        status: "pending",
        createdAt: Date.now(),
      });
    }
    if (existingReg.status !== "pending") {
      await ctx.db.patch(existingReg._id, { status: "pending" });
    }
    return existingReg._id;
  },
});

// ——— NUEVO: Admin 2.0 ———

export const listAllStudents = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isActiveAdmin(ctx))) return [];
    const regs = await ctx.db.query("workshop_registrations").collect();
    const roles = await ctx.db.query("user_roles").collect();
    const profiles = await ctx.db.query("user_profiles").collect();
    const profileByUserId = new Map(profiles.map((p) => [p.userId, p]));

    const rows = [];
    const withUser = new Set();
    for (const reg of regs) {
      const email = reg.email;
      const user = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", email))
        .unique();
      const role = user
        ? await ctx.db
            .query("user_roles")
            .withIndex("by_userId", (q) => q.eq("userId", user._id))
            .unique()
        : null;
      const profile = user ? profileByUserId.get(user._id) : null;
      if (user) withUser.add(user._id);
      rows.push({
        userId: user?._id ?? null,
        email,
        role: role?.role ?? null,
        status: role?.status ?? null,
        name: (user as any)?.name ?? profile?.displayName ?? null,
        phone: (profile as any)?.phone ?? null,
        workshopSlug: reg.workshopSlug,
        workshopStatus: reg.status ?? null,
        createdAt: (reg as any)._creationTime ?? 0,
      });
    }
    // Users con rol pero sin inscripción (ej. admins sin curso asignado)
    for (const roleRow of roles) {
      if (withUser.has(roleRow.userId)) continue;
      const user = await ctx.db.get(roleRow.userId);
      const profile = profileByUserId.get(roleRow.userId);
      rows.push({
        userId: roleRow.userId,
        email: (user as any)?.email ?? null,
        role: roleRow.role,
        status: roleRow.status,
        name: (user as any)?.name ?? profile?.displayName ?? null,
        phone: (profile as any)?.phone ?? null,
        workshopSlug: null,
        workshopStatus: null,
        createdAt: (roleRow as any)._creationTime ?? 0,
      });
    }
    return rows.sort((a, b) => a.createdAt - b.createdAt);
  },
});

// Quitar la invitación/inscripción de un email a un curso (sin borrar la cuenta).
export const removeInvite = mutation({
  args: { email: v.string(), workshopSlug: v.string() },
  handler: async (ctx, args) => {
    await requireActiveAdmin(ctx);
    const email = args.email.toLowerCase().trim();
    const regs = await ctx.db
      .query("workshop_registrations")
      .withIndex("by_email", (q) => q.eq("email", email))
      .filter((q) => q.eq(q.field("workshopSlug"), args.workshopSlug))
      .collect();
    for (const reg of regs) {
      await ctx.db.delete(reg._id);
    }
    return { removed: regs.length };
  },
});

export const updateCourse = mutation({
  args: {
    courseId: v.id("courses"),
    patch: v.object({
      title: v.optional(v.string()),
      tagline: v.optional(v.string()),
      slug: v.optional(v.string()),
      schedule: v.optional(v.string()),
      price: v.optional(v.string()),
      eventInfo: v.optional(v.array(v.object({ label: v.string(), value: v.string() }))),
    }),
  },
  handler: async (ctx, args) => {
    await requireActiveAdmin(ctx);
    const course = await ctx.db.get(args.courseId);
    if (!course) throw new Error("Curso no encontrado");
    // Si cambia slug, verificar no colisione
    if (args.patch.slug && args.patch.slug !== (course as any).slug) {
      const slug = args.patch.slug.toLowerCase().trim();
      if (!/^[a-z0-9-]+$/.test(slug)) throw new Error("Slug solo a-z, 0-9 y -");
      const existing = await ctx.db
        .query("courses")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();
      if (existing) throw new Error(`Ya existe un curso con slug "${slug}"`);
      (args.patch as any).slug = slug;
    }
    await ctx.db.patch(args.courseId, args.patch as any);
    return args.courseId;
  },
});

export const setCourseStatus = mutation({
  args: {
    courseId: v.id("courses"),
    status: v.union(
      v.literal("active"),
      v.literal("full"),
      v.literal("completed"),
      v.literal("disabled"),
    ),
  },
  handler: async (ctx, args) => {
    await requireActiveAdmin(ctx);
    const course = await ctx.db.get(args.courseId);
    if (!course) throw new Error("Curso no encontrado");
    await ctx.db.patch(args.courseId, { status: args.status });
    return args.status;
  },
});

export const inviteStudent = mutation({
  args: { email: v.string(), workshopSlug: v.string(), asPaid: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    await requireActiveAdmin(ctx);
    const email = args.email.toLowerCase().trim();
    if (!email.includes("@")) throw new Error("Email inválido");
    const status = args.asPaid ? "paid" : "pending";
    // NO pre-creamos user/user_roles: el usuario se crea con su primer sign-in
    // (magic link). Pre-crearlo genera un duplicado al autenticar (ver AGENTS).
    const existingReg = await ctx.db
      .query("workshop_registrations")
      .withIndex("by_email", (q) => q.eq("email", email))
      .filter((q) => q.eq(q.field("workshopSlug"), args.workshopSlug))
      .unique();
    if (!existingReg) {
      await ctx.db.insert("workshop_registrations", {
        email,
        workshopSlug: args.workshopSlug,
        status,
        createdAt: Date.now(),
      });
      return { created: true };
    }
    await ctx.db.patch(existingReg._id, { status });
    return { created: false };
  },
});

// Envía el correo de bienvenida al invitar (solo cuando se crea la inscripción).
export const sendInviteEmail = action({
  args: { email: v.string(), workshopSlug: v.string() },
  handler: async (ctx, args) => {
    const callerId = await getAuthUserId(ctx);
    if (!callerId) throw new Error("No autenticado");
    const callerRole = await ctx.runQuery(api.queries.getUserRole);
    if (!callerRole || callerRole.role !== "admin" || callerRole.status !== "active") {
      throw new Error("No autorizado");
    }
    const to = args.email.toLowerCase().trim();
    if (!to.includes("@")) throw new Error("Email inválido");
    // Dispara el flujo de magic link de Resend: el correo llega con un link de un
    // clic (template context-aware en convex/email.ts → bienvenida si hay curso).
    await ctx.runAction(api.auth.signIn, {
      provider: "resend",
      params: { email: to, redirectTo: "/signin" },
    });
    return { sent: true };
  },
});

export const listCoursesAdmin = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isActiveAdmin(ctx))) return [];
    const courses = await ctx.db.query("courses").collect();
    return courses.map((c) => ({
      ...c,
      status: (c as any).status ?? "active",
    }));
  },
});

// Limpieza total de un email en TODAS las tablas (uso operativo con bootstrap secret).
export const clearUserByEmail = mutation({
  args: { email: v.string(), secret: v.string() },
  handler: async (ctx, args) => {
    const expected = process.env.ADMIN_BOOTSTRAP_SECRET;
    if (!expected || args.secret !== expected) throw new Error("Secreto inválido");
    const email = args.email.toLowerCase().trim();
    if (!email.includes("@")) throw new Error("Email inválido");
    let deleted = 0;

    const users = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .collect();
    for (const user of users) {
      const accounts = await ctx.db
        .query("authAccounts")
        .withIndex("userIdAndProvider", (q) => q.eq("userId", user._id))
        .collect();
      for (const account of accounts) {
        const codes = await ctx.db
          .query("authVerificationCodes")
          .withIndex("accountId", (q) => q.eq("accountId", account._id))
          .collect();
        for (const code of codes) {
          await ctx.db.delete(code._id);
          deleted++;
        }
        await ctx.db.delete(account._id);
        deleted++;
      }
      const sessions = await ctx.db
        .query("authSessions")
        .withIndex("userId", (q) => q.eq("userId", user._id))
        .collect();
      const sessionIds = new Set(sessions.map((s) => s._id));
      for (const session of sessions) {
        const tokens = await ctx.db
          .query("authRefreshTokens")
          .withIndex("sessionId", (q) => q.eq("sessionId", session._id))
          .collect();
        for (const token of tokens) {
          await ctx.db.delete(token._id);
          deleted++;
        }
        await ctx.db.delete(session._id);
        deleted++;
      }
      const verifiers = await ctx.db.query("authVerifiers").collect();
      for (const verifier of verifiers) {
        if (verifier.sessionId && sessionIds.has(verifier.sessionId)) {
          await ctx.db.delete(verifier._id);
          deleted++;
        }
      }
      const role = await ctx.db
        .query("user_roles")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .unique();
      if (role) {
        await ctx.db.delete(role._id);
        deleted++;
      }
      const profile = await ctx.db
        .query("user_profiles")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .unique();
      if (profile) {
        await ctx.db.delete(profile._id);
        deleted++;
      }
      await ctx.db.delete(user._id);
      deleted++;
    }

    const limits = await ctx.db
      .query("authRateLimits")
      .withIndex("identifier", (q) => q.eq("identifier", email))
      .collect();
    for (const limit of limits) {
      await ctx.db.delete(limit._id);
      deleted++;
    }
    const leads = await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", email))
      .collect();
    for (const lead of leads) {
      await ctx.db.delete(lead._id);
      deleted++;
    }
    const regs = await ctx.db
      .query("workshop_registrations")
      .withIndex("by_email", (q) => q.eq("email", email))
      .collect();
    for (const reg of regs) {
      await ctx.db.delete(reg._id);
      deleted++;
    }
    return { email, deleted };
  },
});
