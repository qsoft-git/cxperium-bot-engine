// Node modules.
import { Request } from 'express';

// Types.
import { TAppLocalsServices } from '../../types/base-dialog';
import {
	TActivity,
	TTextMessage,
	TImage,
	TDocument,
	TInteractiveMessage,
} from '../../types/whatsapp/activity';
import initEntryPoint from './init-entry-point';
import ServiceInitActivity from '../init-activity';

export default class {
	private services!: TAppLocalsServices;
	private activity!:
		| TActivity
		| TTextMessage
		| TImage
		| TDocument
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
			if (Object.entries(this.activity.flow.responseJson).length == 0) {
				await this.services.whatsapp.message.sendRegularMessage(
					this.activity.from,
					'İşleminiz tamamlanmıştır.',
					// await this.services.cxperium.language.getLanguageByKey(
					// 	this.contact.languageId,
					// 	'key',
					// ),
				);
				return;
			}

			const flow_token = this.services.dialog.cache.get(
				`${this.contact.phone}-flow_token`,
			);

			if (flow_token) {
				await this.services.dialog.runWithFlow(
					this,
					flow_token.toString().split('&')[0],
				);
				return;
			}

			await this.services.dialog.runWithFlow(
				this,
				this.activity.flow?.responseJson?.flow_token?.includes('&')
					? this.activity.flow?.responseJson?.flow_token?.split(
							'&',
						)[0]
					: this.activity.flow?.responseJson?.flow_token,
			);
			return;
		}

		if (await this.services.cxperium.transfer.isSurveyTransfer(this)) {
			if (!customAttributes?.IsKvkkApproved) {
				await this.services.cxperium.contact.updateGdprApprovalStatus(
					this.contact,
					true,
				);
			}
			return;
		}

		if (!customAttributes?.IsKvkkApproved && isGdprActive) {
			await this.services.dialog.runWithIntentName(
				this,
				'CXPerium.Dialogs.WhatsApp.System.Gdpr.KvkkDialog',
			);
			return;
		}

		if (await this.services.cxperium.transfer.isLiveTransfer(this)) return;

		// Init EntryPoint.
		try {
			const entryExists = this.services.dialog.getListAll.find((x: any) =>
				x.name.includes('Entry'),
			);

			if (!entryExists) {
				console.error(
					'Entry.ts has to be created to initialize project. Add Entry.ts class inside your channel file.',
				);
				process.exit(137);
			}

			await initEntryPoint(this);
		} catch (error: any) {
			if (error?.message === 'end') return;
		}

		const conversationCheck: boolean =
			await this.services.dialog.runWithConversationWaitAction(this);

		!conversationCheck && (await this.services.dialog.runWithMatch(this));
	}
}
