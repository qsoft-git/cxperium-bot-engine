// Node modules.
import { Request } from 'express';

// Types.
import { TCxperiumContact } from '../types/cxperium/contact';
import { TAppLocalsServices } from '../types/base-dialog';

export default class {
	req!: Request;
	contact!: TCxperiumContact;
	private services!: TAppLocalsServices;

	constructor(_req: Request) {
		this.req = _req;
		this.services = this.req.app.locals.service;
	}

	async execute(): Promise<void> {
		try {
			const encryptedFlowData = this.req.body.encrypted_flow_data;
			const encryptedAesKey = this.req.body.encrypted_aes_key;
			const initialVector = this.req.body.initial_vector;
		} catch (error) {
			console.error(error);
		}
	}
}
