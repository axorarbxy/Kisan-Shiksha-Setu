import { z } from "zod";

export const roleSchema = z.enum(["mentor", "school", "admin"]);

export const userSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  role: roleSchema,
  avatarUrl: z.string().url().optional(),
});

export const placementSchema = z.object({
  id: z.string().min(1),
  village: z.string().min(1),
  district: z.string().min(1),
  state: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
  status: z.enum(["upcoming", "active", "completed"]),
});

export const mentorProfileSchema = z.object({
  userId: z.string().min(1),
  college: z.string().min(1),
  year: z.string().min(1),
  rawePlacement: placementSchema.optional(),
  topics: z.array(z.string()),
  hoursPerWeek: z.union([z.literal(1), z.literal(3), z.literal(5)]),
});

export const schoolSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  village: z.string().min(1),
  district: z.string().min(1),
  studentCount: z.number().int().nonnegative(),
  grades: z.string(),
  contactName: z.string().min(1),
});

export const matchSchema = z.object({
  id: z.string().min(1),
  mentorId: z.string().min(1),
  schoolId: z.string().min(1),
  status: z.enum(["pending", "active", "completed"]),
  startedAt: z.string(),
});

export const experimentSchema = z.object({
  id: z.string().min(1),
  matchId: z.string().min(1),
  title: z.string().min(1),
  hypothesis: z.string(),
  cropOrTopic: z.string().min(1),
  plotType: z.enum(["family", "community"]),
  status: z.enum(["draft", "active", "completed"]),
  createdAt: z.string(),
});

export const observationSchema = z.object({
  id: z.string().min(1),
  experimentId: z.string().min(1),
  date: z.string(),
  metric: z.string().min(1),
  value: z.number(),
  unit: z.string().optional(),
  notes: z.string().optional(),
  photoUrl: z.string().url().optional(),
});

export const insightSchema = z.object({
  scope: z.enum(["school", "district", "program"]),
  metric: z.string().min(1),
  series: z.array(
    z.object({
      date: z.string(),
      value: z.number(),
    }),
  ),
});

export function pageSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    items: z.array(itemSchema),
    nextCursor: z.string().optional(),
    total: z.number().int().nonnegative(),
  });
}

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const registerInputSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: roleSchema,
});

export const observationInputSchema = observationSchema.omit({
  id: true,
  experimentId: true,
});
export const successResponseSchema = z.object({ success: z.boolean() });

export type User = z.infer<typeof userSchema>;
export type Role = z.infer<typeof roleSchema>;
export type Placement = z.infer<typeof placementSchema>;
export type MentorProfile = z.infer<typeof mentorProfileSchema>;
export type School = z.infer<typeof schoolSchema>;
export type Match = z.infer<typeof matchSchema>;
export type Experiment = z.infer<typeof experimentSchema>;
export type Observation = z.infer<typeof observationSchema>;
export type ObservationInput = z.infer<typeof observationInputSchema>;
export type Insight = z.infer<typeof insightSchema>;
export type Page<T> = {
  items: T[];
  nextCursor?: string;
  total: number;
};

export const userPageSchema: z.ZodType<Page<User>> = pageSchema(userSchema);
export const mentorPageSchema: z.ZodType<Page<MentorProfile>> =
  pageSchema(mentorProfileSchema);
export const schoolPageSchema: z.ZodType<Page<School>> =
  pageSchema(schoolSchema);
export const matchPageSchema: z.ZodType<Page<Match>> = pageSchema(matchSchema);
export const experimentPageSchema: z.ZodType<Page<Experiment>> =
  pageSchema(experimentSchema);
export const observationPageSchema: z.ZodType<Page<Observation>> =
  pageSchema(observationSchema);
export const placementPageSchema: z.ZodType<Page<Placement>> =
  pageSchema(placementSchema);
export type LoginInput = z.infer<typeof loginInputSchema>;
export type RegisterInput = z.infer<typeof registerInputSchema>;
