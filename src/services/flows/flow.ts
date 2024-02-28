// Node modules.
import { Request } from 'express';

// Types.
import { TCxperiumContact } from '../../types/cxperium/contact';
import { TAppLocalsServices } from '../../types/base-dialog';

// Services.
import { decryptRequest, encryptResponse } from '../flows/encrypt';
import ServiceInitActivity from '../init-activity';
import {
	TActivity,
	TDocumentMessage,
	TImageMessage,
	TInteractiveMessage,
	TTextMessage,
} from '../../types/whatsapp/activity';

export default class {
	private req!: Request;
	private contact!: TCxperiumContact;
	private serviceInitActivity: ServiceInitActivity;
	private services!: TAppLocalsServices;

	private activity!:
		| TActivity
		| TTextMessage
		| TImageMessage
		| TDocumentMessage
		| TInteractiveMessage
		| any;
	public place = 'WHATSAPP';

	constructor(_req: Request) {
		this.req = _req;
		this.services = this.req.app.locals.service;
		this.serviceInitActivity = new ServiceInitActivity(this);
	}

	public async execute(): Promise<any> {
		try {
			if (process.env.PRIVATE_PEM_KEY) {
				const request = decryptRequest(
					this.req.body,
					process.env.PRIVATE_PEM_KEY,
				);

				switch (request.decryptedBody.action) {
					case 'ping':
						return this.ping(request);
					case 'data_exchange':
						return await this.dataExchangeResponse(request);
					default:
						throw new Error(
							'Error occurred when using flow for types of PING and DATA_EXCHANGE',
						);
				}
			}

			throw new Error(
				'PRIVATE_PEM_KEY environment variable is not set to anything. Please defined PRIVATE_PEM_KEY',
			);
		} catch (error) {
			console.error(error);
		}
	}

	private ping(request: any) {
		const pingResponse = {
			version: '3.0',
			data: {
				status: 'active',
			},
		};
		const encryptedReponse = encryptResponse(
			pingResponse,
			request.aesKeyBuffer,
			request.initialVectorBuffer,
		);

		return encryptedReponse;
	}

	private async dataExchangeResponse(request: any) {
		// await this.services.dialog.runWithFlow(
		// 	this,
		// 	request.decryptedBody.flow_token,
		// );

		const response = encryptResponse(
			request.decryptedBody,
			request.aesKeyBuffer,
			request.initialVectorBuffer,
		);

		return response;
	}
}
