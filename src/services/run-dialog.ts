// Node modules.
import { Request } from 'express';

// Types.
import { TAppLocalsServices, TBaseDialogCtor } from '../types/base-dialog';
import {
	TActivity,
	TTextMessage,
	TImageMessage,
	TDocumentMessage,
	TInteractiveMessage,
} from '../types/whatsapp/activity';

export default class {
	private services!: TAppLocalsServices;
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
		this.services = this.req.app.locals.service;
	}

	async execute(): Promise<void> {
		// Init which service.
		this.initWhichService();

		// Init activity.
		this.initActivity();

		// Init activity text.
		const text = this.activity.text;

		// Init contact.
		const contact = await this.services.cxperium.contact.getContactByPhone(
			this.activity.from,
			this.activity.userProfileName,
		);

		// Init conversation.
		this.services.cxperium.session.createOrUpdateSession(
			true,
			'TR',
			contact.phone,
			text,
			this.activity.userProfileName,
		);

		// Init conversation.
		this.conversation =
			await this.services.cxperium.session.getConversation(contact.phone);

		// Init cxperium message properties
		this.initCxperiumMessage();

		// if (!Boolean(contact.custom as any['IsKvkkApproved'])) {
		// }

		// if (
		// 	await this.service.cxperium.transfer.isSurveyTransfer(
		// 		contact,
		// 		this.activity,
		// 		this.conversation,
		// 	)
		// ) {
		// 	if (!contact.custom as any['IsKvkkApproved']) {
		// 		this.service.cxperium.contact.updateGdprApprovalStatus(
		// 			contact,
		// 			true,
		// 		);
		// 	}

		// 	return;
		// }

		// if (
		// 	(!contact.custom as any['IsKvkkApproved']) &&
		// 	(await this.service.cxperium.configuration.execute()).gdprConfig
		// 		.isActive
		// ) {
		// 	// TODO
		// 	// new KvkkDialog(contact, activity, conversationState).RunDialog();
		// 	// return;
		// }

		// if (
		// 	await this.service.cxperium.transfer.isLiveTransfer(
		// 		contact,
		// 		this.activity,
		// 	)
		// ) {
		// 	return;
		// }
		// if (this.activity.type === 'document') {
		// 	// TODO
		// }

		// if (this.activity.type === 'order') {
		// 	// TODO
		// }

		// this.services.dialog.runWithIntentName(
		// 	this,
		// 	'CXPerium.Dialogs.WhatsApp.System.Gdpr.KvkkDialog',
		// );

		this.services.dialog.runWithMatchText(this, text);
	}

	private initWhichService(): void {
		const service = this.req.url;

		if (service.startsWith('/whatsapp')) {
		} else if (service.startsWith('/teams')) {
		} else if (service.startsWith('/webchat')) {
		} else {
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
			userProfileName: '',
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
				payload: '',
				text: '',
			},
			isCxperiumMessage: false,
		};

		schemaActivity.userProfileName = this.req.body.contacts[0].profile.name;

		if (type == 'text') {
			schemaActivity.text = data.text.body;
			schemaActivity.type = 'text';
		} else if (type == 'interactive') {
			schemaActivity.type = 'interactive';
			if (data.interactive.button_reply.payload) {
				schemaActivity.value = data.interactive.button_reply.payload;
			}

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

	private initCxperiumMessage(): void {
		const data = this.req.body.messages[0];
		const type = data.type;

		if (type === 'interactive') {
			if (data.interactive.button_reply) {
				const msg: string = data.button_reply.payload
					? data.button_reply.id
					: data.button_reply.payload;

				if (msg.includes('pollbot_') || msg.includes('SID:'))
					this.activity.isCxperiumMessage = true;
			}
			if (data.interactive.list_reply) {
				const msg: string = data.list_reply.id;

				if (msg.includes('SID:'))
					this.activity.isCxperiumMessage = true;
			}
		}

		if (
			this.conversation.lastMessage &&
			this.conversation.lastMessage.includes('SID:')
		)
			this.activity.isCxperiumMessage = true;
	}
}
