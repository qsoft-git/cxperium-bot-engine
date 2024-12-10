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

router.post('/callback', mainController.callback);

export default router;
