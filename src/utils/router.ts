// Services.
import router from '../routes/index';

// Interfaces.
import { IUtilsRouter } from '../interfaces/utils/router';

// Types.
import { Router } from 'express';

export class UtilRouter implements IUtilsRouter {
	router!: Router;

	exportRouter(): Router {
		this.router = router;
		return this.router;
	}
}
