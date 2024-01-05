// Services.
import ServiceCxperium from '.';
import { TCxperiumContact } from '../../types/cxperium/contact';

// Types.
import { TCxperiumServiceParams } from '../../types/cxperium/service';
import { TActivity } from '../../types/whatsapp/activity';
import BaseConversation from '../conversation';

// Services.
import ServiceCxperiumContact from '../cxperium/contact';

export default class extends ServiceCxperium {
	serviceContactService!: ServiceCxperiumContact;
	constructor(data: TCxperiumServiceParams) {
		super(data);
		this.serviceContactService = new ServiceCxperiumContact(data);
	}

	isSurveyTransfer(
		contact: TCxperiumContact,
		activity: TActivity,
		conversation: BaseConversation,
	) {
		const from = activity.from;

		if (Boolean(contact.custom as any['IsCxTransfer'])) {
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
				this.serviceContactService.updateSurveyTransferStatus(
					contact,
					true,
				);
				return true;
			}
		}
	}

	isLiveTransfer(
		contact: TCxperiumContact,
		activity: TActivity,
		conversation: BaseConversation,
	) {
		return true;
	}
}
