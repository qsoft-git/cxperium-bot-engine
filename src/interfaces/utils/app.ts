// Node modules.
import { Application } from 'express';

export interface IUtilsApp {
	app: Application;
	host: string;
	port: string;
	apiKey: string;
	publicPath: string;
	listen(): void;
}
