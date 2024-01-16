// Node modules.
import express from 'express';

// Express router.
const router = express.Router();

// Middlewares.
import middlewareRunDialog from '../middlewares/run-dialog';

// Routes.
router.post('/whatsapp', middlewareRunDialog.executeWhatsapp);
router.post('/messages', middlewareRunDialog.executeMicrosoft);

export default router;
