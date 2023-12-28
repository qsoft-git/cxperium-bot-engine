// Node modules.
import { Application } from 'express';
import { SrcIndexConfig } from '../src-index';

export interface IUtilsApp {
	app: Application;
	host: string;
	port: string;
	publicPath: string;
	execute(): void;
	initAppProperties(data: SrcIndexConfig): void;
	initExpress(): void;
	initMiddlewares(): void;
}
