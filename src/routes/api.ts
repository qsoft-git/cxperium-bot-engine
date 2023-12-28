// Node modules.
import express from 'express';

// Express router.
const router = express.Router();

// Middlewares.
import middlewareWhichService from '../middlewares/which-service';
import middlewareActivity from '../middlewares/activity';

// Routes.
router.post(
	'/whatsapp',
	middlewareWhichService.execute,
	middlewareActivity.execute,
);

export default router;
