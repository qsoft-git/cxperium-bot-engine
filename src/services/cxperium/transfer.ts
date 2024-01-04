// Services.
import ServiceCxperium from '.';
import { TCxperiumContact } from '../../types/cxperium/contact';

// Types.
import { TCxperiumServiceParams } from '../../types/cxperium/service';
import { TActivity } from '../../types/whatsapp/activity';
import BaseConversation from '../conversation';

export default class extends ServiceCxperium {
	constructor(data: TCxperiumServiceParams) {
		super(data);
	}

	isSurveyTransfer(
		contact: TCxperiumContact,
		activity: TActivity,
		conversation: BaseConversation,
	) {
		const from = activity.from;

		if (Boolean(contact.custom as any['IsCxTransfer'])) {
		}

		if (activity.isCxperiumMessage) {
		}
	}

	isLiveTransfer(
		contact: TCxperiumContact,
		activity: TActivity,
		conversation: BaseConversation,
	) {}
}
