// Node modules.
import express from 'express';

// Express router.
const router = express.Router();

// Controllers.
import mainController from '../controllers/main';

// Import routes.
import routerApi from './api';
import routerWebhook from './webhook';

// Routes.
router.use('/api', routerApi);
router.use('/webhook', routerWebhook);
router.get('/error-test', mainController.errorTest);
router.get('/', mainController.homePage);

export default router;
