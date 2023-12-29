// Node modules.
import { Application } from 'express';
import { ISrcIndexConfig } from '../src-index';

export interface IUtilsApp {
	app: Application;
	host: string;
	port: string;
	publicPath: string;
	execute(): void;
	initAppProperties(data: ISrcIndexConfig): void;
	initExpress(): void;
	initMiddlewares(): void;
	initGeneralMiddlewares(): void;
	initAppService(...services: any[]): void;
}
