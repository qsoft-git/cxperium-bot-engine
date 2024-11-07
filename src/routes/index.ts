// ? Node modules.
import express from 'express';

// ? Express router.
const router = express.Router();

// ? Controllers.
import mainController from '../controllers/main';

// ? Import routes.
import routerApi from './api';

// ? Routes.
router.use('/api', routerApi);
router.get('/error-test', mainController.errorTest);
router.get('/', mainController.homePage);

export default router;
