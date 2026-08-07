import { z } from "zod";

export const addToCartSchema = z.object({
  product: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().positive().optional(),
});

export const updateCartSchema = z.object({
  quantity: z.number().int().positive("Quantity must be at least 1"),
});