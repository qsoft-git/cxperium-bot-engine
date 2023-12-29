// Types.
import { TActivity } from '../types/activity';
import { TCxperiumContact } from '../types/cxperium/contact';

// Service.
import BaseConversation from './conversation';

export default class {
	contact: TCxperiumContact;
	activity: TActivity;
	conversation: BaseConversation;

	constructor(
		_contact: TCxperiumContact,
		_activity: TActivity,
		_conversation: BaseConversation,
	) {
		this.activity = _activity;
		this.contact = _contact;
		this.conversation = _conversation;
	}
}
