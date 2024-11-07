// ? Node modules.
import { Request } from 'express';

// ? Types.
import { TCxperiumContact } from '../types/cxperium/contact';
import { TAppLocalsServices, TBaseDialogCtor } from '../types/base-dialog';
import { TConversation } from '../types/conversation';

// ? Services.
import BaseConversation from './conversation';
import { TActivity } from '../types/whatsapp/activity';
import { EMessageEvent } from '../types/message-event';

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
			const event = this.req.body.status
				? this.req.body.status
				: this.req.body.event_status;

			const eventStatusChange = this.req.body.event_status;

			const contactId = this?.req?.body?.contactId
				? this?.req?.body?.contactId
				: this?.req?.body?.contact?.contactId;

			if (contactId) {
				this.contact =
					await this.services.cxperium.contact.getContactByContactId(
						contactId,
					);
			}

			switch (event) {
				case 'NEW': {
					this.messageCreatedEvent(event);
					break;
				}
				case 'OPEN': {
					this.messageCreatedEvent(event);
					break;
				}
				case 'PENDING': {
					this.conversationClosed();
					break;
				}
				case 'CLOSED': {
					if (eventStatusChange === 'CHAT_STATUS_CHANGE') {
						return await this.eventHandler(
							EMessageEvent.ON_LIVE_CHAT_CLOSING,
						);
					}

					return this.conversationClosed();
				}
				case 'OUTSIDE_BUSINESS_HOURS': {
					this.outsideBusinessHours();
					break;
				}
				case 'ASSISTANT_LOCATION_CHANGE': {
					this.clearLanguageCache();
					break;
				}
				case 'ASSISTANT_SESSION_TIMEOUT': {
					return await this.eventHandler(
						EMessageEvent.ON_END_OF_CHAT_SESSION,
					);
				}
				case 'ASSISTANT_INTENT_CHANGE': {
					this.clearIntentCache();
					break;
				}
				case 'CHAT_NORMAL_MESSAGE': {
					this.startMessageByLiveChatPanel(event);
					break;
				}
				case 'COMPLETED':
					this.cxperiumCloseEvent();
					break;
				case 'TIMEOUT':
				case 'LEAVE':
				case 'REPEATED': {
					this.cxperiumCloseEvent();
					break;
				}
				case 'CHAT_ASSIGNEE_CHANGE': {
					this.chatAssignChange();
					break;
				}
			}
		} catch (error) {
			console.error(error);
		}
	}

	private getDialogRunParams(): TBaseDialogCtor {
		const findOneDialog = this.services.dialog.getListAll.find(
			(item: any) => {
				return item.name == 'CXPerium.Dialogs.WhatsApp.Entry';
			},
		) as any;

		const schemaActivity: TActivity = {
			from: this.contact.phone,
			message: '',
			type: 'text',
			userProfileName: '',
			text: '',
			document: {
				id: null,
				byteContent: Buffer.from(''),
				mimeType: null,
				sha256: null,
			},
			video: {
				id: null,
				mime_type: null,
				sha256: null,
				status: null,
				byteContent: Buffer.from(''),
			},
			location: {
				latitude: null,
				longitude: null,
			},
			image: {
				id: null,
				byteContent: null,
				mimeType: null,
				sha256: null,
			},
			value: {
				id: '',
				payload: '',
				text: '',
			},
			flow: {
				isFlow: null,
				responseJson: null,
			},
			isCxperiumMessage: false,
		};

		const conversation: TConversation = this.services.dialog.cache.get(
			`CONVERSATION-${this.contact.phone}`,
		)!;

		const data: TBaseDialogCtor = {
			contact: this.contact,
			activity: schemaActivity,
			conversation: new BaseConversation(
				{
					services: this.services,
					contact: this.contact,
				},
				conversation,
			),
			dialogFileParams: {
				name: findOneDialog.name,
				path: findOneDialog.path,
				place: `RUN MESSAGE EVENT: ${EMessageEvent.ON_END_OF_CHAT_SESSION}`,
			},
			services: this.services,
		};

		data.conversation.dialogFileParams = data.dialogFileParams;

		return data;
	}

	private async eventHandler(event: EMessageEvent) {
		try {
			const mapping: Record<EMessageEvent, string> = {
				0: 'NOT_AVAILABLE',
				1: 'NOT_AVAILABLE',
				2: 'NOT_AVAILABLE',
				3: 'NOT_AVAILABLE',
				4: 'onEndOfChatSession',
				5: 'onClosingOfLiveChat',
			};

			const data: TBaseDialogCtor = this.getDialogRunParams();
			const eventFunc: string = mapping[event];
			const dialogImport = await import(data.dialogFileParams.path);
			const dialog = new dialogImport.default(data);
			await dialog[eventFunc]();
		} catch (error) {
			throw new Error(`${event} not implemented error!`);
		}
	}

	private clearLanguageCache(): void {
		this.services.cxperium.language.cache.del('ALL_LANGUAGES');
	}

	private chatAssignChange() {
		this.services.cxperium.contact.updateLiveTransferStatus(
			this.contact,
			true,
		);
	}

	private clearIntentCache(): void {
		this.services.cxperium.intent.cache.del('all-intents');
	}

	private messageCreatedEvent(event: any): void {
		if (this.contact != null) {
			const chatId = event.chat_id?.ToString();
			this.services.cxperium.contact.updateLiveTransferStatus(
				this.contact,
				true,
			);

			if (chatId) {
				this.services.cxperium.contact.updateContactByCustomFields(
					this.contact,
					{ ChatId: chatId },
				);
			}
		}
	}

	private conversationClosed(): void {
		this.services.cxperium.contact.updateLiveTransferStatus(
			this.contact,
			false,
		);
		this.services.cxperium.contact.updateSurveyTransferStatus(
			this.contact,
			false,
		);

		this.services.cxperium.session.closeActiveSessions();
	}

	private outsideBusinessHours(): void {
		this.services.cxperium.contact.updateLiveTransferStatus(
			this.contact,
			false,
		);
	}

	private startMessageByLiveChatPanel(event: any): void {
		this.messageCreatedEvent(event);
	}

	private cxperiumCloseEvent() {
		this.services.cxperium.contact.updateSurveyTransferStatus(
			this.contact,
			false,
		);
	}
}
