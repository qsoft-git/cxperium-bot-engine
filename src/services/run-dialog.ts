// Node modules.
import { Request } from 'express';

// Types.
import { TAppLocalsServices } from '../types/base-dialog';
import {
	TActivity,
	TTextMessage,
	TImageMessage,
	TDocumentMessage,
	TInteractiveMessage,
} from '../types/whatsapp/activity';

export default class {
	private service!: TAppLocalsServices;
	private whichService!: string;
	private activity!:
		| TActivity
		| TTextMessage
		| TImageMessage
		| TDocumentMessage
		| TInteractiveMessage
		| any;
	private contact!: any;
	private conversation!: any;

	constructor(private req: Request) {
		this.service = this.req.app.locals.service;
	}

	async execute(): Promise<void> {
		// Init which service.
		this.initWhichService();

		// Init activity.
		this.initActivity();

		const serviceCxperiumIntent = this.service.cxperium.intent;

		const serviceDialog = this.service.dialog;

		const text = this.activity.text;
	}

	private initWhichService(): void {
		const service = this.req.url;

		if (service.startsWith('/whatsapp')) {
			this.whichService = 'WHATSAPP';
		} else if (service.startsWith('/teams')) {
			this.whichService = 'TEAMS';
		} else if (service.startsWith('/webchat')) {
			this.whichService = 'WEBCHAT';
		} else {
			this.whichService = 'UNKNOWN';
		}
	}

	private initActivity(): void {
		const data = this.req.body.messages[0];
		const type = data.type;

		const schemaActivity:
			| TActivity
			| TTextMessage
			| TImageMessage
			| TDocumentMessage
			| TInteractiveMessage = {
			from: data.from,
			type: '',
			text: '',
			document: {
				id: '',
				byteContent: new Buffer(''),
				mimeType: '',
				sha256: '',
			},
			image: {
				id: '',
				byteContent: new Buffer(''),
				mimeType: '',
				sha256: '',
			},
			value: {
				id: '',
				text: '',
			},
		};

		if (type == 'text') {
			schemaActivity.text = data.text.body;
			schemaActivity.type = 'text';
		} else if (type == 'interactive') {
			schemaActivity.type = 'interactive';
			schemaActivity.value = data.interactive.list_reply
				? data.interactive.list_reply
				: data.interactive.button_reply;
		} else if (type == 'image') {
			schemaActivity.type = 'image';
			schemaActivity.image.id = data.image.id;
			schemaActivity.image.mimeType = data.image.mimeType;
			schemaActivity.image.sha256 = data.image.sha256;
		} else if (type == 'document') {
			schemaActivity.type = 'document';
			schemaActivity.document.id = data.document.id;
			schemaActivity.document.mimeType = data.document.mimeType;
			schemaActivity.document.sha256 = data.document.sha256;
		}

		this.activity = schemaActivity;
	}
}
