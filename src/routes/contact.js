import { Router } from 'express';
import { validateBody, contactSchema } from '../middleware/validate.js';
import { sendContactEmail } from '../utils/mailer.js';

const router = Router();

router.post('/', validateBody(contactSchema), async (req, res) => {
  try {
    await sendContactEmail(req.body);
    res.json({ ok: true });
  } catch (err) {
    console.error('Mail error:', err.message);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
