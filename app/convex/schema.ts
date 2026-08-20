// @ts-nocheck
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  user_roles: defineTable({
    userId: v.id("users"),
    role: v.union(v.literal("viewer"), v.literal("admin")),
    status: v.union(v.literal("pending"), v.literal("active")),
  }).index("by_userId", ["userId"]),

  // Ejemplo para leads del workshop (alineado con validación de mercado)
  leads: defineTable({
    email: v.string(),
    profession: v.optional(v.string()),
    pain: v.optional(v.string()),
    source: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  workshop_registrations: defineTable({
    email: v.string(),
    workshopSlug: v.string(),
    status: v.union(v.literal("pending"), v.literal("paid"), v.literal("cancelled")),
    createdAt: v.number(),
  }).index("by_email", ["email"]).index("by_workshop", ["workshopSlug"]),
});
