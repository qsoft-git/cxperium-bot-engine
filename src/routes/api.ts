// Node modules.
import express from 'express';

// Express router.
const router = express.Router();

// Middlewares.
import middlewareDialog from '../middlewares/dialog';

// Routes.
router.post('/whatsapp', middlewareDialog.execute);

export default router;
