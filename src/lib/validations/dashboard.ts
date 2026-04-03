import { z } from "zod";

export const dashboardCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  templateId: z.string().optional(),
});

export const dashboardUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  theme: z.string().optional(),
  visibility: z.enum(["private", "public", "unlisted"]).optional(),
});

export const dashboardConfigSchema = z.object({
  version: z.number(),
  layouts: z.object({
    lg: z.array(z.any()),
    md: z.array(z.any()),
    sm: z.array(z.any()),
  }),
  widgets: z.record(z.string(),
    z.object({
      type: z.string(),
      config: z.record(z.string(), z.unknown()),
      addedAt: z.string(),
    })
  ),
});
