// Node modules.
import express from 'express';
import * as fs from 'fs';
import * as path from 'path';

// Interfaces.
import { IIndexExport } from './interfaces/index-export';

interface Config {
	mode: string;
	host: string;
	port: string;
	apiKey: string;
	dialogPath: string;
}

// Export default module.
export class Engine implements IIndexExport {
	app!: express.Application;
	mode!: string;
	host!: string;
	port!: string;
	apiKey!: string;
	dialogPath!: string;

	constructor({
		mode: _mode,
		host: _host,
		port: _port,
		apiKey: _apiKey,
		dialogPath: _dialogPath,
	}: Config) {
		// Initialize express application.
		this.app = express();

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
		return fs.readdirSync(this.dialogPath);
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
