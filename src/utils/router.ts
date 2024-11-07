// ? Types.
import { Router } from 'express';

// ? Interfaces.
import { IUtilsRouter } from '../interfaces/utils/router';

// ? Services.
import router from '../routes/index';

export class UtilRouter implements IUtilsRouter {
	router!: Router;

	exportRouter(): Router {
		this.router = router;
		return this.router;
	}
}
