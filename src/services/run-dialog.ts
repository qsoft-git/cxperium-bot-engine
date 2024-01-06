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
	private service!: TAppLocalsServices;
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
		const serviceCxperium = this.service.cxperium;
		const text = this.activity.text;
		const contact = await serviceCxperium.contact.getContactByPhone(
			this.activity.from,
			this.activity.userProfileName,
		);
		serviceCxperium.session.createOrUpdateSession(
			true,
			'TR',
			contact.phone,
			text,
			this.activity.userProfileName,
		);

		const conversation = await serviceCxperium.session.getConversation(
			contact.phone,
		);
		this.conversation = conversation;

		// Init cxperium message properties
		this.initCxperiumMessage();

		const cxperiumAllIntents = serviceCxperiumIntent.cache.get(
			'all-intents',
		) as any;

		const intent = cxperiumAllIntents.find((item: any) =>
			new RegExp(item.regexValue).test(text),
		);

		if (!Boolean(contact.custom as any['IsKvkkApproved'])) {
		}

		if (
			await serviceCxperium.transfer.isSurveyTransfer(
				contact,
				this.activity,
				this.conversation,
			)
		) {
			if (!contact.custom as any['IsKvkkApproved']) {
				serviceCxperium.contact.updateGdprApprovalStatus(contact, true);
			}

			return;
		}

		if (
			(!contact.custom as any['IsKvkkApproved']) &&
			(await serviceCxperium.configuration.execute()).gdprConfig.isActive
		) {
			// TODO
			// new KvkkDialog(contact, activity, conversationState).RunDialog();
			// return;
		}

		if (
			await serviceCxperium.transfer.isLiveTransfer(
				contact,
				this.activity,
			)
		) {
			return;
		}
		if (this.activity.type === 'document') {
			// TODO
		}

		if (this.activity.type === 'order') {
			// TODO
		}

		if (intent) {
			const intentName = intent.name;

			const findAllDialogs = serviceDialog.getListAll;

			const findOneDialog = findAllDialogs.find(
				(item: any) => intentName === item?.name,
			) as any;

			const runParams: TBaseDialogCtor = {
				contact: this.contact,
				activity: this.activity,
				conversation: this.conversation,
				dialogPath: findOneDialog.path,
				services: this.service,
			};

			serviceDialog
				.run(runParams)
				.then(() => {})
				.catch((error: any) => console.log(error));
		}
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
