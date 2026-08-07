import { z } from "zod";

export const createReviewSchema = z.object({
  product: z.string().min(1, "Product ID is required"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(2, "Comment is required"),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(2).optional(),
});