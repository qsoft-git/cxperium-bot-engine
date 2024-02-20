// Node modules.
import express from 'express';

// Express router.
const router = express.Router();

// Middlewares.
import middlewareRunDialog from '../middlewares/run-dialog';
import middlewareWebhook from '../middlewares/webhook';

// Routes.
router.post('/whatsapp', middlewareRunDialog.executeWhatsapp);
router.post('/messages', middlewareRunDialog.executeMicrosoft);
router.post('/webhook/transfer', middlewareWebhook.execute);

export default router;
