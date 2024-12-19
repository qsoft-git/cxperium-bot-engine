// ? Node modules.
import { Request } from 'express';

// ? Types.
import { TCxperiumContact } from '../../types/cxperium/contact';
import { TAppLocalsServices } from '../../types/base-dialog';

// ? Services.
import { decryptRequest, encryptResponse } from '../flows/encrypt';
import ServiceInitActivity from '../init-activity';
import {
	TActivity,
	TDocument,
	TImage,
	TInteractiveMessage,
	TTextMessage,
} from '../../types/whatsapp/activity';
import { decryptMedia } from './media';
import { FlowResponse } from '../../types/whatsapp/flow-response';

interface DataExchangeRequest {
	decryptedBody: DecryptedBody;
	aesKeyBuffer: Buffer;
	initialVectorBuffer: Buffer;
}

interface DecryptedBody {
	action: 'ping' | 'data_exchange' | 'INIT' | 'BACK';
	data: Record<string, any>;
	flow_token: string;
	screen: string;
	version: string;
}

export default class {
	private req!: Request;
	private contact!: TCxperiumContact;
	private serviceInitActivity!: ServiceInitActivity;
	private conversation!: any;
	private activity!:
		| TActivity
		| TTextMessage
		| TImage
		| TDocument
		| TInteractiveMessage
		| any;
	private services!: TAppLocalsServices;

	constructor(_req: Request) {
		this.req = _req;
		this.services = this.req.app.locals.service;
		this.serviceInitActivity = new ServiceInitActivity(this);
	}

	public async execute(): Promise<any> {
		try {
			if (process?.env?.PRIVATE_PEM_KEY) {
				const request = decryptRequest(
					this.req.body,
					process.env.PRIVATE_PEM_KEY,
				);

				switch (request.decryptedBody.action) {
					case 'ping':
						return this.ping(request);
					case 'data_exchange':
						return await this.handleDataExchangeResponse(request);
					case 'INIT':
						return await this.handleDataExchangeResponse(request);
					case 'BACK':
						return await this.handleRefreshOnBack(request);
					default:
						throw new Error(
							'Error occurred when using flow for types of PING and DATA_EXCHANGE',
						);
				}
			}

			throw new Error(
				'PRIVATE_PEM_KEY environment variable is not set . Please defined PRIVATE_PEM_KEY',
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

	private async handleRefreshOnBack(request: DataExchangeRequest) {
		const initAttr = await this.initThisAttributes(request);
		const decryptedBody = await this.generateDecryptedBody(request);
		const refreshOnBack = await this.services.dialog.createRefreshOnBack();
		const response = await refreshOnBack.execute(
			this,
			decryptedBody,
			initAttr.intent,
		);

		return this.returnResponse(request, response);
	}

	private async handleDataExchangeResponse(request: DataExchangeRequest) {
		const initAttr = await this.initThisAttributes(request);
		const decryptedBody = await this.generateDecryptedBody(request);

		const returnResponse =
			await this.services.dialog.createReturnResponse();

		const response = await returnResponse.execute(
			this,
			decryptedBody,
			initAttr.intent,
		);

		return this.returnResponse(request, response);
	}

	private async returnResponse(
		request: DataExchangeRequest,
		response: FlowResponse,
	) {
		encryptResponse(
			response,
			request.aesKeyBuffer,
			request.initialVectorBuffer,
		);
	}

	private async generateDecryptedBody(request: DataExchangeRequest) {
		const mediaFiles = await decryptMedia(
			request.decryptedBody.data.images ||
				request.decryptedBody.data.documents,
		);

		const decryptedBody: DecryptedBody = {
			action: request.decryptedBody.action,
			data: {
				...request.decryptedBody.data,
				files: mediaFiles,
			},
			flow_token: request.decryptedBody.flow_token,
			screen: request.decryptedBody.screen,
			version: request.decryptedBody.version,
		};

		delete decryptedBody?.data?.images;
		delete decryptedBody?.data?.documents;

		return decryptedBody;
	}

	private async initThisAttributes(
		request: any,
	): Promise<{ intent: string; phone: string }> {
		const intent = request.decryptedBody.flow_token.split('&')[0];
		const phone = request.decryptedBody.flow_token.split('&')[1];

		this.activity = {
			flow: {
				isFlow: true,
				responseJson: request.decryptedBody,
			},
			from: phone,
		};

		this.contact =
			await this.services.cxperium.contact.getContactByPhone(this);
		this.conversation =
			await this.services.cxperium.session.getConversation(this);

		return {
			intent,
			phone,
		};
	}
}
