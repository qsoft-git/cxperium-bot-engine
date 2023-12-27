// Environment.
const { NODE_ENV } = process.env;

// Node modules.
import { Application } from 'express';

// Utils.
import generalMiddlewares from './general-middlewares';

// Routes.
import routes from '../routes';

// Middlewares.
import middlewareMain from '../middlewares/main';

// Interfaces.
import { IUtilsApp } from '../interfaces/utils/app';

// Export default module.
export class App implements IUtilsApp {
	app!: Application;
	host!: string;
	port!: string;
	apiKey!: string;
	publicPath!: string;

	public initMiddlewares(): void {
		// Set general middlewares.
		generalMiddlewares.init(this.app, this.publicPath);

		// Set routes and middlewares.
		this.app.use(routes);
		this.app.use(middlewareMain.notFoundHandler);
		this.app.use(middlewareMain.errorHandler);
	}

	public listen(): void {
		this.app.listen(this.port, () => {
			console.table({
				mode: NODE_ENV,
				host: this.host,
				port: this.port,
				message: 'Listening Cxperium ChatBot Engine',
			});
		});
	}
}
