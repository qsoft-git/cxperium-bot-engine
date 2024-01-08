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
	}

	async isSurveyTransfer(
		contact: TCxperiumContact,
		activity: TActivity,
		conversation: BaseConversation,
	) {
		const from = activity.from;
		const customAttributes = contact.custom as any;

		if (customAttributes.IsKvkkApproved) {
			// TODO
			// new CxperiumCatchDialog(
			// 	contact,
			// 	activity,
			// 	conversation,
			// ).RedirectMessage();
			// return true;
		}

		if (activity.isCxperiumMessage) {
			if (activity.type === 'interactive') {
				if (activity.value.id) {
					const msg = activity.value.id
						? activity.value.payload
						: activity.value.id;

					if (
						msg.includes('pollbot_ticket_') ||
						msg.includes('cxperium_ticket_')
					) {
						const ticketId: string = msg.split('_')[2];
						// TODO
						// new TicketResponseDialog(
						// 	contact,
						// 	activity,
						// 	conversation
						// ).RunDialogByTicketId(ticketId);
					} else {
						// TODO
						// new CxperiumCatchDialog(
						// 	contact,
						// 	activity,
						// 	conversation
						// ).RedirectMessage();
						// CxContact.UpdateCxTransfer(contact, true);
					}
				}

				return true;
			} else if (activity.text) {
				// TODO
				// new CxperiumCatchDialog(
				// 	contact,
				// 	activity,
				// 	conversation,
				// ).StartSurvey(conversation.LastMessage);
				await this.serviceCxperiumContact.updateSurveyTransferStatus(
					contact,
					true,
				);
				return true;
			}
		}
	}

	async isLiveTransfer(contact: TCxperiumContact, activity: TActivity) {
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
				if (
					await this.serviceCxperiumConversation.chatExists(
						contact._id,
					)
				) {
					this.serviceCxperiumConversation.create(contact._id);
				}

				await this.serviceCxperiumMessage.sendWhatsappMessage(
					contact.custom as any['ChatId'],
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
