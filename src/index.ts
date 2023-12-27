// Node modules.
import express from 'express';
import * as path from 'path';

// Utils.
import { App } from './utils/app';
import { Dialog } from './utils/dialog';

// Interfaces.
import { SrcIndexConfig } from './interfaces/src-index';

// Helpers.
import applyClassMixins from './helpers/apply-class-mixins';

export interface Engine extends App, Dialog {}

export class Engine {
	constructor({
		host: _host,
		port: _port,
		apiKey: _apiKey,
		srcPath: _srcPath,
	}: SrcIndexConfig) {
		// Initialize express application.
		this.app = express();

		// Set properties.
		this.port = _port || '3978';
		this.host = _host || 'localhost';
		this.apiKey = _apiKey;
		this.dialogPath = path.join(_srcPath, '/', 'dialog');
		this.publicPath = path.join(_srcPath, '/', 'public');

		if (!this.apiKey) {
			throw new Error('API_KEY is not set.');
		}

		// Initialize middlewares.
		this.initMiddlewares();

		this.app.listDialog = this.initDialog();
		this.app.getDialog = this.catchDialog;
	}
}

applyClassMixins.run(Engine, [App, Dialog]);
