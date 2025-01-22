// ? Services.
import ServiceCxperium from '.';
import { TCxperiumContact } from '../../types/cxperium/contact';

// ? Types.
import { TCxperiumServiceParams } from '../../types/cxperium/service';
import { TActivity } from '../../types/whatsapp/activity';
import BaseConversation from '../conversation';
import { TAppLocalsServices } from '../../types/base-dialog';
import { TConversation } from '../../types/conversation';
import { Dialog } from '../../types/dialog';

// ? Services.
import ServiceCxperiumContact from '../cxperium/contact';
import ServiceCxperiumConfiguration from '../cxperium/configuration';
import ServiceCxperiumMessage from '../cxperium/message';
import ServiceCxperiumChat from './chat';
import ServiceCxperiumLanguage from '../cxperium/language';
import ServiceWhatsAppMessage from '../whatsapp/message';

// ? Environments.
const { OUT_TICKET } = process.env;

export default class extends ServiceCxperium {
	serviceCxperiumContact!: ServiceCxperiumContact;
	serviceCxperiumConfiguration!: ServiceCxperiumConfiguration;
	serviceCxperiumMessage!: ServiceCxperiumMessage;
	serviceCxperiumChat!: ServiceCxperiumChat;
	serviceCxperiumLanguage!: ServiceCxperiumLanguage;
	serviceWhatsAppMessage!: ServiceWhatsAppMessage;

	private TRANSFER_TO_REPRESENTATIVE_KEY =
		'transfer_to_represantative' as const;

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
		this.serviceCxperiumChat = new ServiceCxperiumChat(data);
	}

	async isSurveyTransfer(dialog: any): Promise<boolean> {
		const activity = dialog.activity;
		const contact = dialog.contact;
		const conversation: BaseConversation = dialog.conversation;
		const services: TAppLocalsServices = dialog.services;
		const customAttributes = dialog.contact.custom as any;

		if (JSON.parse(customAttributes?.IsCxTransfer || false)) {
			await services.cxperium.message.redirectWpMessage(
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
						//! TİCKET HATASI BURADA

						if (OUT_TICKET === 'true') {
							await dialog.services.dialog.runWithIntentName(
								dialog,
								'CXPerium.Dialogs.WhatsApp.Ticket.TicketResponseDialog',
							);
						} else {
							await dialog.services.dialog.runWithIntentName(
								dialog,
								'CXPerium.Dialogs.WhatsApp.System.Ticket.TicketResponseDialog',
							);
						}
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
					dialog?.contact,
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
		dialog: Dialog,
	) {
		if (surveyId.includes('pollbot')) surveyId = surveyId.split('_')[1];
		if (!surveyId.includes('SID')) surveyId = `SID: ${surveyId}`;

		await this.serviceCxperiumContact.updateSurveyTransferStatus(
			contact,
			true,
		);

		const messages = {
			contacts: [
				{
					profile: { name: dialog.activity.userProfileName },
					wa_id: dialog.activity.from,
				},
			],
			messages: [
				{
					from: dialog.activity.from,
					id: dialog.activity.from,
					text: { body: surveyId },
					timestamp: Date.now(),
					type: dialog.activity.type,
				},
			],
		};

		await this.serviceCxperiumMessage.redirectWpMessage(messages);
	}

	async isLiveTransfer(dialog: any): Promise<boolean> {
		const contact: TCxperiumContact = dialog.contact;
		const activity: TActivity = dialog.activity;
		const conversation: TConversation = dialog.conversation.conversation;
		const customAttributes = contact.custom as any;
		const env = await this.serviceCxperiumConfiguration.execute();

		if (!env?.cxperiumLiveConfig?.IsActive) {
			return false;
		}

		if (JSON.parse(customAttributes?.IsCxLiveTransfer || false)) {
			if (
				activity.type === 'document' ||
				activity.type === 'image' ||
				activity.type === 'video'
			) {
				const byteContent = activity[activity.type].byteContent as
					| Uint8Array
					| Buffer;

				const base64string = Buffer.isBuffer(byteContent)
					? byteContent.toString('base64')
					: Buffer.from(byteContent).toString('base64');

				await this.serviceCxperiumMessage.sendWhatsappMessageWithFile(
					customAttributes.ChatId,
					activity.text,
					contact.phone,
					base64string,
					activity[activity.type].mimeType!,
				);
			} else {
				const chatExists = await this.serviceCxperiumChat.chatExists(
					contact._id,
				);

				if (!chatExists) {
					this.serviceCxperiumChat.create(contact._id);
				}

				const custom: any = contact.custom;

				await this.serviceCxperiumMessage.sendMessageToCxperiumApi(
					custom.ChatId,
					conversation.lastMessage,
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
		try {
			const isAvailable =
				await this.serviceCxperiumMessage.checkBusinessHour();

			if (!isAvailable) {
				await this.handleOutsideBusinessHours(contact, conversation);
				return true;
			}

			const chatId = await this.createChat(contact);

			await this.updateContactWithChatId(contact, chatId);

			const lastMessage = conversation.getLastMessage();

			await this.sendLastMessageToWhatsapp(
				chatId,
				lastMessage,
				contact.phone,
			);

			await this.sendTransferMessage(contact, conversation);

			await this.serviceCxperiumContact.updateLiveTransferStatus(
				contact,
				true,
			);
			return true;
		} catch (error) {
			console.error('Error during transfer to representative:', error);
			return false;
		}
	}

	private async handleOutsideBusinessHours(
		contact: TCxperiumContact,
		conversation: BaseConversation,
	): Promise<void> {
		try {
			const message =
				await this.serviceCxperiumMessage.getOutsideBusinessHoursMessage(
					conversation.conversation.cultureCode,
				);

			await this.serviceWhatsAppMessage.sendRegularMessage(
				contact.phone,
				message,
			);
		} catch (error) {
			console.error('Error handling outside business hours:', error);
			throw error;
		}
	}

	private async createChat(contact: TCxperiumContact): Promise<string> {
		try {
			return await this.serviceCxperiumChat.create(contact._id);
		} catch (error) {
			console.error('Error creating conversation:', error);
			throw error;
		}
	}

	private async updateContactWithChatId(
		contact: TCxperiumContact,
		chatId: string,
	): Promise<void> {
		try {
			await this.serviceCxperiumContact.updateContactByCustomFields(
				contact,
				{
					ChatId: chatId,
				},
			);
		} catch (error) {
			console.error('Error updating contact with chat ID:', error);
			throw error;
		}
	}

	private async sendLastMessageToWhatsapp(
		chatId: string,
		lastMessage: string,
		phone: string,
	): Promise<void> {
		try {
			await this.serviceCxperiumMessage.sendMessageToCxperiumApi(
				chatId,
				lastMessage,
				phone,
			);
		} catch (error) {
			console.error('Error sending last message to WhatsApp:', error);
			throw error;
		}
	}

	private async sendTransferMessage(
		contact: TCxperiumContact,
		conversation: BaseConversation,
	): Promise<void> {
		try {
			const message = await this.serviceCxperiumLanguage.getLanguageByKey(
				conversation.conversation.languageId,
				this.TRANSFER_TO_REPRESENTATIVE_KEY,
			);

			await this.serviceWhatsAppMessage.sendRegularMessage(
				contact.phone,
				message,
			);
		} catch (error) {
			console.error('Error sending transfer message:', error);
			throw error;
		}
	}

	async transferToRepresentatives(
		contact: TCxperiumContact,
		conversation: BaseConversation,
		teamId: string,
	): Promise<boolean> {
		const isBusinessHourAvailable =
			await this.serviceCxperiumMessage.checkBusinessHour();

		if (!isBusinessHourAvailable) {
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

		const id = await this.serviceCxperiumChat.create(contact._id);

		await this.serviceCxperiumContact.updateContactByCustomFields(contact, {
			ChatId: id,
		});

		const lastMessage = conversation.getLastMessage();

		await this.serviceCxperiumMessage.sendMessageToCxperiumApi(
			id,
			lastMessage,
			contact.phone,
		);

		const transferingToRepresentativeMessage =
			await this.serviceCxperiumLanguage.getLanguageByKey(
				conversation.conversation.languageId,
				'transfer_to_represantative',
			);

		await this.serviceWhatsAppMessage.sendRegularMessage(
			contact.phone,
			transferingToRepresentativeMessage,
		);

		await this.serviceCxperiumMessage.assignChatToTeam(id, teamId);

		await this.serviceCxperiumContact.updateLiveTransferStatus(
			contact,
			true,
		);

		return true;
	}
}
