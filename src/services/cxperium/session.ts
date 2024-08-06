// Fetch Retry.
import fetchRetry from '../fetch';

// Datas.
import DataGeneral from '../../data/general';

// Services.
import ServiceCxperium from '.';
import ServiceCxperiumContact from './contact';
import ServiceCxperiumConversation from './conversation';
import ServiceCxperiumConfiguration from './configuration';
import ServiceCxperiumLanguage from './language';
import ServiceWhatsAppMessage from '../whatsapp/message';

// Types.
import { TCxperiumServiceParams } from '../../types/cxperium/service';
import { TConversation } from '../../types/conversation';
import BaseConversation from '../conversation';

export default class extends ServiceCxperium {
	public cache: any;
	serviceCxperiumContact!: ServiceCxperiumContact;
	serviceCxperiumConversation!: ServiceCxperiumConversation;
	serviceCxperiumConfiguration!: ServiceCxperiumConfiguration;
	serviceCxperiumLanguage!: ServiceCxperiumLanguage;
	serviceWhatsAppMessage!: ServiceWhatsAppMessage;

	constructor(data: TCxperiumServiceParams) {
		super(data);
		this.cache = DataGeneral.cache;
		this.serviceCxperiumContact = new ServiceCxperiumContact(data);
		this.serviceCxperiumConversation = new ServiceCxperiumConversation(
			data,
		);
		this.serviceCxperiumConfiguration = new ServiceCxperiumConfiguration(
			data,
		);
		this.serviceCxperiumLanguage = new ServiceCxperiumLanguage(data);
		this.serviceWhatsAppMessage = new ServiceWhatsAppMessage(
			this.serviceCxperiumConfiguration,
		);
	}

	async createOrUpdateSession(
		isActive: boolean,
		language: string,
		message: string,
		dialog: any,
	) {
		if (!language) language = 'TR';

		const phone = dialog.contact.phone;
		const body = {
			language: language,
			phone: phone,
			data: [
				{
					message: message,
					isLast: true,
				},
			],
			isActive: isActive,
		};

		await fetchRetry(`${this.baseUrl}/api/assistant/session`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		});

		await this.updateConversationSessionTime(dialog);
	}

	async updateConversationSessionTime(dialog: any) {
		const contact =
			await this.serviceCxperiumContact.getContactByPhone(dialog);

		if (contact)
			await this.serviceCxperiumContact.updateContactConversationDateByContactId(
				contact._id,
			);
	}

	async getAllActiveSessions() {
		const response = (await fetchRetry(
			this.baseUrl + '/api/assistant/session',
			{
				method: 'GET',
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			},
		).then((response) => response.json())) as any;

		return response;
	}

	async getConversationWhatsapp(dialog: any) {
		const phone: string = dialog.contact.phone;

		const response = (await fetchRetry(
			`${this.baseUrl}/api/assistant/session/${phone}`,
			{
				method: 'GET',
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			},
		).then((response) => response.json())) as any;

		let lastMessage;

		for (const message of response?.data[0]?.data) {
			if (Boolean(message.isLast)) {
				lastMessage = message.message;
				break;
			}
		}

		let conversation: TConversation | undefined = this.cache.get(
			`CONVERSATION-${phone}`,
		);

		if (!conversation) {
			conversation = {
				languageId: 1,
				conversationData: [],
				waitData: {
					className: '',
					functionName: '',
				},
				sessionData: response.data[0].data,
				lastMessage: lastMessage,
				cultureCode: 'TR',
				cache: {},
			};

			this.cache.set(`CONVERSATION-${phone}`, conversation);
		}

		return new BaseConversation(dialog, conversation);
	}

	async getConversationMicrosoft(dialog: any) {
		const id: string = dialog.activity.from.id;

		let conversation: TConversation | undefined = this.cache.get(
			`CONVERSATION-${id}`,
		);

		if (!conversation) {
			conversation = {
				languageId: 1,
				conversationData: [],
				waitData: {
					className: '',
					functionName: '',
				},
				sessionData: [],
				lastMessage: '',
				cultureCode: 'TR',
				cache: {},
			};

			this.cache.set(`CONVERSATION-${id}`, conversation);
		}

		return new BaseConversation(dialog, conversation);
	}

	private async closeSession(
		phone: string,
		language: string,
		message: string,
	): Promise<void> {
		const body = {
			language,
			phone,
			data: [
				{
					message: message,
					isLast: true,
				},
			],
			isActive: false,
		};

		await fetchRetry(`${this.baseUrl}/api/assistant/session`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		});
	}

	async closeActiveSessions() {
		const sessions = await this.getAllActiveSessions();

		sessions.forEach(async (session: any) => {
			await this.closeSession(session.phone, session.language, '');
		});
	}

	async closeActiveSessionsWithTransfer() {
		const sessionTimeout = Number(
			(await this.serviceCxperiumConfiguration.execute())
				.sessionTimeoutConfig.Minutes,
		);
		const activeSessions = await this.getAllActiveSessions();

		if (activeSessions) {
			const date = Date.now();

			for (const session of activeSessions?.data) {
				if (session.isActive) {
					const updateDifference = date - session.updatedAt;
					const createDifference = date - session.createdAt;

					if (
						updateDifference >= sessionTimeout &&
						createDifference >= sessionTimeout &&
						session.isActive
					) {
						const message =
							await this.serviceCxperiumLanguage.getLanguageByKey(
								session.language,
								'SessionTimeoutMessage',
							);
						const contact =
							await this.serviceCxperiumContact.getContactByPhone(
								session.phone,
							);

						await this.closeSession(
							session.phone,
							session.language,
							'',
						);

						const hasOpenChat =
							await this.serviceCxperiumContact.checkOpenChat(
								String(contact._id),
							);

						if (hasOpenChat) {
							await this.serviceCxperiumConversation.closeLiveChat(
								contact,
							);
							await this.serviceCxperiumContact.updateLiveTransferStatus(
								contact,
								false,
							);
						} else {
							await this.serviceWhatsAppMessage.sendRegularMessage(
								session.phone,
								message,
							);
						}

						await this.serviceCxperiumContact.updateSurveyTransferStatus(
							contact,
							false,
						);
					}
				}
			}
		}
	}
}
