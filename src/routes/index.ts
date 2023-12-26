// Node modules.
import express from 'express';

// Express router.
const router = express.Router();

// Controllers.
import errorTest from '../controllers/error-test';

router.get('/', (req, res) => {
	res.send('Hello World!');
});

router.get('/error-test', errorTest);

export default router;
