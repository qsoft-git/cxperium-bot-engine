// Environment.
const { NODE_ENV } = process.env;

// Node modules.
import express from 'express';
import * as fs from 'fs';
import * as path from 'path';

// Utils.
import generalMiddlewares from './utils/general-middlewares';

// Routes.
import routes from './routes';

// Middlewares.
import middlewareErrorHandler from './middlewares/error-handler';
import middlewareNotFound from './middlewares/not-found';

// Interfaces.
import { IIndexExport } from './interfaces/index-export';

// Config interface.
interface Config {
	mode: string;
	host: string;
	port: string;
	apiKey: string;
	dialogPath: string;
	publicPath: string;
}

// Export default module.
export class Engine implements IIndexExport {
	app!: express.Application;
	mode!: string;
	host!: string;
	port!: string;
	apiKey!: string;
	dialogPath!: string;
	puclicPath!: string;

	constructor({
		mode: _mode,
		host: _host,
		port: _port,
		apiKey: _apiKey,
		dialogPath: _dialogPath,
		publicPath: _publicPath,
	}: Config) {
		// Initialize express application.
		this.app = express();

		// Set general middlewares.
		generalMiddlewares(this.app, _publicPath);

		// Set routes and middlewares.
		this.app.use(routes);
		this.app.use(middlewareNotFound);
		this.app.use(middlewareErrorHandler);

		// Set properties.
		this.port = _port;
		this.host = _host;
		this.mode = _mode;
		this.apiKey = _apiKey;
		this.dialogPath = _dialogPath;
	}

	async catchDialog(file: string) {
		return await import(path.join(this.dialogPath, file));
	}

	initDialog(): string[] {
		let filterFindFiles: string[] = [];
		const findFiles = fs.readdirSync(this.dialogPath);
		const catchFileExtension = NODE_ENV === 'development' ? '.ts' : '.js';

		if (findFiles.length > 0) {
			filterFindFiles = findFiles.filter((file) => {
				const fileExtension = path.extname(file);
				return fileExtension === catchFileExtension;
			});
		}

		return filterFindFiles;
	}

	// Listening express application.
	async listen(): Promise<void> {
		const aaaa = this.initDialog();

		const bbbb = await this.catchDialog(aaaa[0]);

		const cccc = new bbbb.default();

		cccc.runDialog();

		this.app.listen(this.port, () => {
			console.table({
				mode: this.mode,
				host: this.host,
				port: this.port,
				message: 'Listening Cxperium ChatBot Engine',
			});
		});
	}
}
