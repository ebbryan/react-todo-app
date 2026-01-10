import { z } from "zod";

export const todoSchema = z.object({
  id: z
    .string()
    .optional()
    .default(() => crypto.randomUUID()),
  title: z.string().min(1, { message: "Todo title cannot be empty" }),
  status: z
    .enum(["completed", "pending", "in-progress"])
    .optional()
    .default("pending"),
  dateCreated: z
    .string()
    .or(z.date())
    .optional()
    .default(() => new Date()),
});

export type TodoInput = z.input<typeof todoSchema>;
export type Todo = z.output<typeof todoSchema>;
