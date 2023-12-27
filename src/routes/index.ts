// Node modules.
import express from 'express';

// Express router.
const router = express.Router();

// Controllers.
import mainController from '../controllers/main';

// Routes.
router.get('/error-test', mainController.errorTest);
router.get('/', mainController.homePage);

export default router;
