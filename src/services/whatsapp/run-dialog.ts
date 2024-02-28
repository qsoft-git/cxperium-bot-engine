// Node modules.
import { Request } from 'express';

// Types.
import { TAppLocalsServices, TBaseDialogCtor } from '../../types/base-dialog';
import {
	TActivity,
	TTextMessage,
	TImageMessage,
	TDocumentMessage,
	TInteractiveMessage,
} from '../../types/whatsapp/activity';
import initEntryPoint from './init-entry-point';
import ServiceInitActivity from '../init-activity';

export default class {
	private services!: TAppLocalsServices;
	private activity!:
		| TActivity
		| TTextMessage
		| TImageMessage
		| TDocumentMessage
		| TInteractiveMessage
		| any;
	private conversation!: any;
	private contact!: any;
	public place = 'WHATSAPP';
	private serviceInitActivity!: ServiceInitActivity;

	constructor(private req: Request) {
		this.services = this.req.app.locals.service;
		this.serviceInitActivity = new ServiceInitActivity(this);
	}

	async execute(): Promise<void> {
		// Init activity.
		await this.serviceInitActivity.initActivity();

		// Init activity text.
		const text = this.activity.text;

		// Init contact.
		this.contact =
			await this.services.cxperium.contact.getContactByPhone(this);

		const customAttributes = this.contact.custom as any;

		// Init conversation.
		await this.services.cxperium.session.createOrUpdateSession(
			true,
			'TR',
			text,
			this,
		);

		// Init conversation.
		this.conversation =
			await this.services.cxperium.session.getConversationWhatsapp(this);

		const isGdprActive = (
			await this.services.cxperium.configuration.execute()
		).gdprConfig.IsActive;

		// Init cxperium message properties
		this.serviceInitActivity.initCxperiumMessage();

		if (this.activity.flow.isFlow) {
			await this.services.dialog.runWithFlow(
				this,
				this.activity.flow.responseJson.flow_token,
			);
			return;
		}

		if (await this.services.cxperium.transfer.isSurveyTransfer(this)) {
			if (!customAttributes.IsKvkkApproved) {
				await this.services.cxperium.contact.updateGdprApprovalStatus(
					this.contact,
					true,
				);
			}
			return;
		}

		if (!customAttributes.IsKvkkApproved && isGdprActive) {
			await this.services.dialog.runWithIntentName(
				this,
				'CXPerium.Dialogs.WhatsApp.System.Gdpr.KvkkDialog',
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

		if (await this.services.cxperium.transfer.isLiveTransfer(this)) return;

		const conversationCheck: boolean =
			await this.services.dialog.runWithConversationWaitAction(this);

		!conversationCheck && (await this.services.dialog.runWithMatch(this));
	}
}
