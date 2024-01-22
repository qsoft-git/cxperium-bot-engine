// Services.
import ServiceCxperium from '.';
import { TCxperiumContact } from '../../types/cxperium/contact';

// Types.
import { TCxperiumServiceParams } from '../../types/cxperium/service';
import { TActivity } from '../../types/whatsapp/activity';
import BaseConversation from '../conversation';

// Services.
import ServiceCxperiumContact from '../cxperium/contact';
import ServiceCxperiumConfiguration from '../cxperium/configuration';
import ServiceCxperiumMessage from '../cxperium/message';
import ServiceCxperiumConversation from '../cxperium/conversation';
import ServiceCxperiumLanguage from '../cxperium/language';
import ServiceWhatsAppMessage from '../whatsapp/message';
import { TAppLocalsServices } from '../../types/base-dialog';

export default class extends ServiceCxperium {
	serviceCxperiumContact!: ServiceCxperiumContact;
	serviceCxperiumConfiguration!: ServiceCxperiumConfiguration;
	serviceCxperiumMessage!: ServiceCxperiumMessage;
	serviceCxperiumConversation!: ServiceCxperiumConversation;
	serviceCxperiumLanguage!: ServiceCxperiumLanguage;
	serviceWhatsAppMessage!: ServiceWhatsAppMessage;

	constructor(data: TCxperiumServiceParams) {
		super(data);
		this.serviceCxperiumConfiguration = new ServiceCxperiumConfiguration(
			data,
		);
		this.serviceCxperiumContact = new ServiceCxperiumContact(data);
		this.serviceCxperiumMessage = new ServiceCxperiumMessage(data);
		this.serviceCxperiumLanguage = new ServiceCxperiumLanguage(data);
		this.serviceWhatsAppMessage = new ServiceWhatsAppMessage(
			this.serviceCxperiumConfiguration,
		);
		this.serviceCxperiumConversation = new ServiceCxperiumConversation(
			data,
		);
	}

	async isSurveyTransfer(dialog: any) {
		const activity = dialog.activity;
		const contact = dialog.contact;
		const conversation: BaseConversation = dialog.conversation;
		const services: TAppLocalsServices = dialog.services;
		const customAttributes = dialog.contact.custom as any;

		if (customAttributes.IsCxTransfer) {
			services.cxperium.message.redirectWpMessage(
				dialog.activity.message,
			);
			return true;
		}

		if (activity.isCxperiumMessage) {
			if (activity.type === 'interactive') {
				if (activity.value.id) {
					const msg = activity.value.id
						? activity.value.id
						: activity.value.payload;

					if (
						msg.includes('pollbot_ticket_') ||
						msg.includes('cxperium_ticket_')
					) {
						const ticketId: string = msg.split('_')[2];
						conversation.setCache('ticketId', ticketId);
						dialog.runWithIntentName(
							this,
							'CXPerium.Dialogs.WhatsApp.System.TicketResponseDialog',
						);
					} else {
						await this.startSurvey(msg, contact, dialog);
						await this.serviceCxperiumContact.updateSurveyTransferStatus(
							dialog.contact,
							true,
						);
					}
				}

				return true;
			} else if (activity.text) {
				await this.startSurvey(activity.text, contact, dialog);

				await this.serviceCxperiumContact.updateSurveyTransferStatus(
					dialog.contact,
					true,
				);

				return true;
			}
		}

		return false;
	}

	async startSurvey(
		surveyId: string,
		contact: TCxperiumContact,
		dialog: any,
	) {
		if (!surveyId.includes('SID')) surveyId = `SID: ${surveyId}`;

		await this.serviceCxperiumContact.updateSurveyTransferStatus(
			contact,
			true,
		);

		const messages = {
			contacts: dialog.activity.message.contacts,
			messages: [
				{
					from: dialog.activity.message.messages[0].from,
					id: dialog.activity.message.messages[0].id,
					text: { body: surveyId },
					timestamp: dialog.activity.message.messages[0].timestamp,
					type: dialog.activity.message.messages[0].type,
				},
			],
		};

		await this.serviceCxperiumMessage.redirectWpMessage(messages);
	}

	async isLiveTransfer(dialog: any) {
		const contact: TCxperiumContact = dialog.contact;
		const activity: TActivity = dialog.activity;
		const customAttributes = contact.custom as any;
		const env = await this.serviceCxperiumConfiguration.execute();

		if (!env.cxperiumLiveConfig.IsActive) return false;

		if (customAttributes.IsCxLiveTransfer) {
			if (activity.type === 'document') {
				const base64string = Buffer.from(
					activity.document.byteContent,
				).toString('base64');

				this.serviceCxperiumMessage.sendWhatsappMessageWithFile(
					contact.custom as any['ChatId'],
					activity.text,
					contact.phone,
					base64string,
					activity.document.id,
					activity.document.mimeType,
				);
			} else if (activity.type === 'image') {
				const base64string = Buffer.from(
					activity.image.byteContent,
				).toString('base64');

				this.serviceCxperiumMessage.sendWhatsappMessageWithFile(
					contact.custom as any['ChatId'],
					activity.text,
					contact.phone,
					base64string,
					activity.image.id,
					activity.image.mimeType,
				);
			} else {
				const chatExists =
					await this.serviceCxperiumConversation.chatExists(
						contact._id,
					);

				if (!chatExists) {
					this.serviceCxperiumConversation.create(contact._id);
				}

				const custom: any = contact.custom;

				await this.serviceCxperiumMessage.sendWhatsappMessage(
					custom.ChatId,
					activity.text,
					contact.phone,
				);
			}

			return true;
		}

		return false;
	}

	async transferToRepresentative(
		contact: TCxperiumContact,
		conversation: BaseConversation,
	): Promise<boolean> {
		const isAvailable =
			await this.serviceCxperiumMessage.checkBusinessHour();

		if (!isAvailable) {
			const message =
				await this.serviceCxperiumMessage.getOutsideBusinessHoursMessage(
					conversation.conversation.cultureCode,
				);

			await this.serviceWhatsAppMessage.sendRegularMessage(
				contact.phone,
				message,
			);
			return true;
		}

		const id = await this.serviceCxperiumConversation.create(contact._id);

		await this.serviceCxperiumContact.updateContactByCustomFields(contact, {
			ChatId: id,
		});

		const lastMessage = conversation.conversation.sessionData[
			conversation.conversation.sessionData.length - 1
		] as any['message'];

		await this.serviceCxperiumMessage.sendWhatsappMessage(
			id,
			lastMessage.message,
			contact.phone,
		);

		await this.serviceWhatsAppMessage.sendRegularMessage(
			contact.phone,
			await this.serviceCxperiumLanguage.getLanguageByKey(
				conversation.conversation.languageId,
				'transfer_to_represantative',
			),
		);

		await this.serviceCxperiumContact.updateLiveTransferStatus(
			contact,
			true,
		);
		return true;
	}

	async transferToRepresentatives(
		contact: TCxperiumContact,
		conversation: BaseConversation,
		teamId: string,
	): Promise<boolean> {
		if (await this.serviceCxperiumMessage.checkBusinessHour()) {
			const message =
				await this.serviceCxperiumMessage.getOutsideBusinessHoursMessage(
					conversation.conversation.cultureCode,
				);

			await this.serviceWhatsAppMessage.sendRegularMessage(
				contact.phone,
				message,
			);
			return true;
		}

		const id = await this.serviceCxperiumConversation.create(contact._id);

		await this.serviceCxperiumContact.updateContactByCustomFields(contact, {
			ChatId: id,
		});

		await this.serviceCxperiumMessage.sendWhatsappMessage(
			id,
			conversation.conversation.sessionData[
				conversation.conversation.sessionData.length - 2
			] as any['message'],
			contact.phone,
		);

		await this.serviceWhatsAppMessage.sendRegularMessage(
			contact.phone,
			await this.serviceCxperiumLanguage.getLanguageByKey(
				conversation.conversation.languageId,
				'transfer_to_represantative',
			),
		);

		await this.serviceCxperiumMessage.assignChatToTeam(id, teamId);
		await this.serviceCxperiumContact.updateLiveTransferStatus(
			contact,
			true,
		);
		return true;
	}
}
