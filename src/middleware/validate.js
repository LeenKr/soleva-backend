import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  projectType: z.string().optional(),  // make required if your form always sends it
  budget: z.string().optional(),
  message: z.string().min(10, "Message too short"),
  agree: z.boolean().optional(),       // make required if you have a checkbox
});

export function validateBody(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors });
    }
    req.body = parsed.data;
    next();
  };
}
