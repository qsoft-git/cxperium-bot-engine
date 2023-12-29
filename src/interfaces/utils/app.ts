// Node modules.
import { Application } from 'express';

// Types.
import { TSrcIndexConfig } from '../../types/src-index';

export interface IUtilsApp {
	app: Application;
	host: string;
	port: string;
	publicPath: string;
	execute(): void;
	initAppProperties(data: TSrcIndexConfig): void;
	initExpress(): void;
	initMiddlewares(): void;
	initGeneralMiddlewares(): void;
	initAppService(...services: any[]): void;
}
