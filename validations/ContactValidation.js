import { z } from "zod";

export const createContactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  message: z.string().min(5, "Message is required"),
});

export const updateContactStatusSchema = z.object({
  status: z.enum(["NEW", "READ", "RESOLVED"]),
});