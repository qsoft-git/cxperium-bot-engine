// Node modules.
import { Request } from 'express';

// Types.
import { TurnContext } from 'botbuilder';

// Types.
import { TAppLocalsServices } from '../../../types/base-dialog';
import {
	TActivity,
	TDocumentMessage,
	TImageMessage,
	TInteractiveMessage,
	TTextMessage,
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
	public place = 'TEAMS';

	constructor(
		private req: Request,
		private context: TurnContext,
	) {
		this.services = this.req.app.locals.service;
	}

	async execute(): Promise<void> {
		// Init activity,
		this.initActivity();

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
				'CXPerium.Dialogs.Teams.System.Gdpr.KvkkDialog',
			);
			return;
		}

		if (this.context?.activity?.value?.keyIntent) {
			return await this.services.dialog.runWithIntentName(
				this,
				this.context?.activity?.value?.keyIntent,
			);
		}

		// Init EntryPoint.
		try {
			await initEntryPoint(this);
		} catch (error: any) {
			if (error?.message === 'end') {
				return;
			}
		}

		const conversationCheck: boolean =
			await this.services.dialog.runWithConversationWaitAction(this);

		!conversationCheck && (await this.services.dialog.runWithMatch(this));
	}

	private initActivity(): void {
		this.activity = this.context.activity;
	}
}
