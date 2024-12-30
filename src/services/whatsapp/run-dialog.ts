// ? Node modules.
import { Request } from 'express';

// ? Types.
import { TAppLocalsServices } from '../../types/base-dialog';
import { TActivity } from '../../types/whatsapp/activity';
import initEntryPoint from './init-entry-point';
import ServiceInitActivity from '../init-activity';
import { Dialog } from '../../types/dialog';

export default class {
	private services!: TAppLocalsServices;
	private activity!: TActivity;
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

		const dialog: Dialog = {
			contact: this.contact,
			activity: this.activity,
			conversation: this.conversation,
			services: this.services,
		};

		// Init contact.
		dialog.contact =
			await this.services.cxperium.contact.getContactByPhone(dialog);

		const customAttributes = dialog.contact?.custom as any;

		// Update last message time.
		await this.services.cxperium.session.updateLastMessageTime(dialog);

		// Init conversation.
		dialog.conversation =
			await this.services.cxperium.session.getConversation(dialog);
		this.conversation = dialog.conversation;

		const isGdprActive = (
			await this.services.cxperium.configuration.execute()
		).gdprConfig.IsActive;

		// Init cxperium message properties
		dialog.activity = await this.serviceInitActivity.initCxperiumMessage();

		if (dialog.activity.flow.isFlow) {
			if (
				Object.entries(dialog.activity.flow.responseJson!).length == 0
			) {
				await this.services.whatsapp.message.sendRegularMessage(
					dialog.activity.from,
					'İşleminiz tamamlanmıştır.',
				);
				return;
			}

			const flow_token = this.services.dialog.cache.get(
				`${dialog.contact.phone}-flow_token`,
			);

			const receiveFlow = await this.services.dialog.createReceiveFlow();

			if (flow_token) {
				await receiveFlow.execute(
					dialog,
					undefined,
					flow_token.toString().split('&')[0],
				);
				return;
			}

			const responseJson = dialog.activity?.flow?.responseJson as any;

			await receiveFlow.execute(
				dialog,
				undefined,
				responseJson.flow_token?.includes('&')
					? responseJson?.flow_token?.split('&')[0]
					: responseJson?.flow_token,
			);
			return;
		}

		if (await this.services.cxperium.transfer.isSurveyTransfer(dialog)) {
			if (!customAttributes?.IsKvkkApproved) {
				await this.services.cxperium.contact.updateGdprApprovalStatus(
					dialog.contact,
					true,
				);
			}
			return;
		}

		if (!customAttributes?.IsKvkkApproved && isGdprActive) {
			await this.services.dialog.runWithIntentName(
				dialog,
				'CXPerium.Dialogs.WhatsApp.System.Gdpr.KvkkDialog',
			);
			return;
		}

		if (await this.services.cxperium.transfer.isLiveTransfer(dialog)) {
			return;
		}

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

			await initEntryPoint(dialog);
		} catch (error: any) {
			if (error?.message === 'end') return;
		}

		const conversationCheck: boolean =
			await this.services.dialog.runWithConversationWaitAction(dialog);

		!conversationCheck && (await this.services.dialog.runWithMatch(dialog));
	}
}
