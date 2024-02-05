// Node modules.
import { Request } from 'express';

// Types.
import { TurnContext } from 'botbuilder';

// Types.
import { TAppLocalsServices } from '../../../types/base-dialog';

// Helpers.
import HelperDecrypt from '../../../helpers/decryption';
import {
	TActivity,
	TTextMessage,
	TImageMessage,
	TDocumentMessage,
	TInteractiveMessage,
} from '../../../types/whatsapp/activity';
import initEntryPoint from './init-entry-point';

export default class {
	private services!: TAppLocalsServices;
	private contact!: any;
	private activity!:
		| TActivity
		| TTextMessage
		| TImageMessage
		| TDocumentMessage
		| TInteractiveMessage
		| any;
	private conversation!: any;
	public place = 'WEBCHAT';

	constructor(
		private req: Request,
		private context: TurnContext,
	) {
		this.services = this.req.app.locals.service;
	}

	async execute(): Promise<void> {
		// Init activity,
		this.initActivity();

		const from = this.context.activity.from.name;
		const username = HelperDecrypt.decrypt(from);

		this.context.activity.from.name = username;

		// Init contact.
		this.contact =
			await this.services.cxperium.contact.getContactByBotframeworkId(
				this,
			);
		this.conversation =
			await this.services.cxperium.session.getConversationMicrosoft(this);

		const customAttributes = this.contact.custom as any;

		const isGdprActive = (
			await this.services.cxperium.configuration.execute()
		).gdprConfig.IsActive;

		if (!customAttributes.IsKvkkApproved && isGdprActive) {
			await this.services.dialog.runWithIntentName(
				this,
				'CXPerium.Dialogs.Webchat.System.Gdpr.KvkkDialog',
			);
			return;
		}

		// Init EntryPoint.
		try {
			await initEntryPoint(this);
		} catch (error: any) {
			if (error?.message === 'end') {
				return;
			}
		}

		await this.services.dialog.runWithMatch(this);
	}

	private initActivity(): void {
		this.activity = this.context.activity;
	}
}
