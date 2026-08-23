// @ts-nocheck
import { mutation, query } from "./_generated/server";
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

export const approveUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await requireActiveAdmin(ctx);
    const target = await ctx.db
      .query("user_roles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    if (!target) throw new Error("Usuario sin rol");
    await ctx.db.patch(target._id, { status: "active" });
    return target._id;
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

export const listPendingUsers = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isActiveAdmin(ctx))) return [];
    const roles = await ctx.db.query("user_roles").collect();
    const pending = roles.filter((r) => r.status === "pending");
    return await Promise.all(
      pending.map(async (r) => {
        const user = await ctx.db.get(r.userId);
        return {
          userId: r.userId,
          email: user?.email ?? null,
          name: user?.name ?? null,
          role: r.role,
        };
      }),
    );
  },
});

export const listRegistrations = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isActiveAdmin(ctx))) return [];
    const registrations = await ctx.db.query("workshop_registrations").collect();
    return registrations.sort((a, b) => a.createdAt - b.createdAt);
  },
});

// Crear estudiante sin pago (para pruebas) — usa bootstrap secret
export const addStudent = mutation({
  args: { email: v.string(), secret: v.string(), name: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const expected = process.env.ADMIN_BOOTSTRAP_SECRET;
    if (!expected || args.secret !== expected) throw new Error("Secreto inválido");
    const email = args.email.toLowerCase();
    let user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), email))
      .unique();
    if (!user) {
      const userId = await ctx.db.insert("users", {
        email,
        name: args.name,
      } as any);
      user = await ctx.db.get(userId);
    }
    if (!user) throw new Error("No se pudo crear usuario");
    let role = await ctx.db
      .query("user_roles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();
    if (!role) {
      await ctx.db.insert("user_roles", { userId: user._id, role: "viewer", status: "active" });
    } else if (role.status !== "active") {
      await ctx.db.patch(role._id, { status: "active" });
    }
    const existingReg = await ctx.db
      .query("workshop_registrations")
      .withIndex("by_email", (q) => q.eq("email", email))
      .filter((q) => q.eq(q.field("workshopSlug"), "finanzas-personales-ia"))
      .unique();
    if (!existingReg) {
      await ctx.db.insert("workshop_registrations", {
        email,
        workshopSlug: "finanzas-personales-ia",
        status: "pending",
        createdAt: Date.now(),
      });
    } else if (existingReg.status !== "pending") {
      await ctx.db.patch(existingReg._id, { status: "pending" });
    }
    return user._id;
  },
});

// ——— NUEVO: Admin 2.0 ———

export const listAllStudents = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isActiveAdmin(ctx))) return [];
    const roles = await ctx.db.query("user_roles").collect();
    const regs = await ctx.db.query("workshop_registrations").collect();
    const profiles = await ctx.db.query("user_profiles").collect();
    const regByEmail = new Map(regs.map((r) => [r.email, r]));
    const profileByUserId = new Map(profiles.map((p) => [p.userId, p]));
    return await Promise.all(
      roles.map(async (r) => {
        const user = await ctx.db.get(r.userId);
        const email = (user?.email ?? "") as string;
        const reg = regByEmail.get(email.toLowerCase());
        const profile = profileByUserId.get(r.userId);
        return {
          userId: r.userId,
          role: r.role,
          status: r.status,
          email: email || null,
          name: (user as any)?.name ?? profile?.displayName ?? null,
          phone: (profile as any)?.phone ?? null,
          workshopSlug: reg?.workshopSlug ?? null,
          workshopStatus: (reg?.status as string) ?? null,
          createdAt: (r as any)._creationTime ?? 0,
        };
      }),
    );
  },
});

export const revokeUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await requireActiveAdmin(ctx);
    const role = await ctx.db
      .query("user_roles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    if (!role) throw new Error("Usuario sin rol");
    // Nunca borrar, solo pasar a pending (revocado)
    await ctx.db.patch(role._id, { status: "pending" });
    const user = await ctx.db.get(args.userId);
    const email = (user as any)?.email?.toLowerCase();
    if (email) {
      const reg = await ctx.db
        .query("workshop_registrations")
        .withIndex("by_email", (q) => q.eq("email", email))
        .unique();
      if (reg && reg.status === "paid") {
        await ctx.db.patch(reg._id, { status: "pending" });
      }
    }
    return role._id;
  },
});

export const updateCourse = mutation({
  args: {
    courseId: v.id("courses"),
    patch: v.object({
      title: v.optional(v.string()),
      tagline: v.optional(v.string()),
      schedule: v.optional(v.string()),
      price: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    await requireActiveAdmin(ctx);
    const course = await ctx.db.get(args.courseId);
    if (!course) throw new Error("Curso no encontrado");
    await ctx.db.patch(args.courseId, args.patch as any);
    return args.courseId;
  },
});

export const toggleCourseStatus = mutation({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    await requireActiveAdmin(ctx);
    const course = await ctx.db.get(args.courseId);
    if (!course) throw new Error("Curso no encontrado");
    const current = (course as any).status ?? "active";
    const next = current === "active" ? "archived" : "active";
    await ctx.db.patch(args.courseId, { status: next } as any);
    return next;
  },
});

export const inviteStudent = mutation({
  args: { email: v.string(), workshopSlug: v.string(), asPaid: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    await requireActiveAdmin(ctx);
    const email = args.email.toLowerCase().trim();
    if (!email.includes("@")) throw new Error("Email inválido");
    const status = args.asPaid ? "paid" : "pending";
    // Usuario
    let user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), email))
      .unique();
    if (!user) {
      const userId = await ctx.db.insert("users", { email } as any);
      user = await ctx.db.get(userId);
    }
    if (!user) throw new Error("No se pudo crear usuario");
    // Rol viewer activo (invitado directo, no pendiente)
    const existingRole = await ctx.db
      .query("user_roles")
      .withIndex("by_userId", (q) => q.eq("userId", user!._id))
      .unique();
    if (!existingRole) {
      await ctx.db.insert("user_roles", { userId: user._id, role: "viewer", status: "active" });
    } else if (existingRole.status !== "active") {
      await ctx.db.patch(existingRole._id, { status: "active" });
    }
    // Registro workshop
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
    } else {
      await ctx.db.patch(existingReg._id, { status });
    }
    return user._id;
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
