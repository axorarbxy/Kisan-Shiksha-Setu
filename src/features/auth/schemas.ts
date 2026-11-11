import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const registerBaseSchema = z.object({
  name: z.string().trim().min(1, "Enter your name."),
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const registerSchema = z.discriminatedUnion("role", [
  registerBaseSchema.extend({
    role: z.literal("mentor"),
    college: z.string().trim().min(1, "Enter your college."),
    year: z.enum(["1", "2", "3", "4"], {
      error: "Choose your year of study.",
    }),
    phone: z.string().optional(),
  }),
  registerBaseSchema.extend({
    role: z.literal("school"),
    schoolName: z.string().trim().min(1, "Enter your school name."),
    village: z.string().trim().min(1, "Enter your village."),
    district: z.string().trim().min(1, "Enter your district."),
    studentCount: z
      .number({ error: "Enter the number of students." })
      .int("Enter a whole number.")
      .nonnegative("Student count cannot be negative."),
  }),
  registerBaseSchema.extend({
    role: z.literal("admin"),
    collegeName: z.string().trim().min(1, "Enter your college name."),
    designation: z.string().trim().min(1, "Enter your designation."),
  }),
]);

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
