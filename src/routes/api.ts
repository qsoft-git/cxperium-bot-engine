// Node modules.
import express from 'express';

// Express router.
const router = express.Router();

// Middlewares.
import middlewareWhichService from '../middlewares/which-service';
import middlewareActivity from '../middlewares/activity';
import middlewareRunDialog from '../middlewares/run-dialog';

// Routes.
router.post(
	'/whatsapp',
	middlewareWhichService.execute,
	middlewareActivity.execute,
	middlewareRunDialog.execute,
);

export default router;
