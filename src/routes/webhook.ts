// Node modules.
import express from 'express';

// Express router.
const router = express.Router();

// Middlewares.
import middlewareWebhook from '../middlewares/webhook';

// Routes.
router.post('/transfer', middlewareWebhook.execute);

export default router;
