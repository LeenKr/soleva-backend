import { Router } from "express";
import { validateBody, contactSchema } from "../middleware/validate.js";
import { sendContactEmail } from "../utils/mailer.js";

const router = Router();

router.post("/", validateBody(contactSchema), async (req, res) => {
  try {
    const info = await sendContactEmail(req.body);
    console.log("Mail sent:", info?.messageId);
    res.json({ ok: true, messageId: info?.messageId });
  } catch (err) {
    console.error("Mail error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
