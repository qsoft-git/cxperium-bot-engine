// ? Node modules.
import { Application } from 'express';
import * as Sentry from '@sentry/node';

// ? Types.
import { TSrcIndexConfig } from '../../types/src-index';

export interface IUtilsApp {
	app: Application;
	host: string;
	port: string;
	publicPath: string;
	execute(): void;
	initAppProperties(data: TSrcIndexConfig): void;
	initExpress(): void;
	initMiddlewares(sentry: typeof Sentry): void;
	initGeneralMiddlewares(): void;
	initAppService(...services: any[]): void;
}
