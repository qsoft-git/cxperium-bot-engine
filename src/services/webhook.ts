// Node modules.
import { Request } from 'express';

// Types.
import { TCxperiumContact } from '../types/cxperium/contact';
import { TAppLocalsServices } from '../types/base-dialog';

export default class {
	req!: Request;
	contact!: TCxperiumContact;
	private services!: TAppLocalsServices;

	constructor(_req: Request) {
		this.req = _req;
		this.services = this.req.app.locals.service;
	}

	async execute(): Promise<void> {
		try {
			const event = this.req.body.includes('status')
				? this.req.body.status
				: this.req.body.event_status.toString();

			const contactId = this.req.body.contactId;
			let contact: any;

			if (contactId)
				contact =
					await this.services.cxperium.contact.getContactByContactId(
						contactId,
					);
			else contact = null;

			switch (event) {
				case 'NEW': {
					this.messageCreatedEvent(event, contact);
					break;
				}
				case 'OPEN': {
					this.messageCreatedEvent(event, contact);
					break;
				}
				case 'PENDING': {
					this.conversationClosed(contact);
					break;
				}
				case 'CLOSED': {
					this.conversationClosed(contact);
					break;
				}
				case 'OUTSIDE_BUSINESS_HOURS': {
					this.outsideBusinessHours(contact);
					break;
				}
				case 'ASSISTANT_LOCATION_CHANGE': {
					// ClearLanguagesCache();
					break;
				}
				case 'ASSISTANT_INTENT_CHANGE': {
					// ClearIntentsCache();
					break;
				}
				case 'CHAT_NORMAL_MESSAGE': {
					this.startMessageByLiveChatPanel(event, contact);
					break;
				}
				case 'COMPLETED':
				case 'TIMEUOT':
				case 'LEAVE':
				case 'REPEATED': {
					this.cxperiumCloseEvent(contact);
					break;
				}
				case 'CHAT_ASSIGNEE_CHANGE': {
					// ChatAssingChangeEvent(message);
					break;
				}
			}
		} catch (error) {
			console.error(error);
		}
	}

	private messageCreatedEvent(event: any, contact: TCxperiumContact): void {
		if (contact != null) {
			const chatId = event.chat_id?.ToString();
			this.services.cxperium.contact.updateLiveTransferStatus(
				contact,
				true,
			);

			if (chatId) {
				this.services.cxperium.contact.updateContactByCustomFields(
					contact,
					{ ChatId: chatId },
				);
			}
		}
	}

	private conversationClosed(contact: TCxperiumContact): void {
		if (contact) {
			this.services.cxperium.contact.updateLiveTransferStatus(
				contact,
				false,
			);
		}
	}

	private outsideBusinessHours(contact: TCxperiumContact): void {
		this.services.cxperium.contact.updateLiveTransferStatus(contact, false);
	}

	private startMessageByLiveChatPanel(
		event: any,
		contact: TCxperiumContact,
	): void {
		if (contact) {
			this.messageCreatedEvent(event, contact);
		}
	}

	private cxperiumCloseEvent(contact: TCxperiumContact) {
		this.services.cxperium.contact.updateSurveyTransferStatus(
			contact,
			false,
		);
	}
}
