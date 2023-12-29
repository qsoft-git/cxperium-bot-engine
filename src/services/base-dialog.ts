// Types.
import { TActivity } from '../types/activity';
import { TCxperiumContact } from '../types/cxperium/contact';
import { TBaseDialogCtor } from '../types/base-dialog';

// Services.
import BaseConversation from './conversation';

export default class {
	contact: TCxperiumContact;
	activity: TActivity;
	conversation: BaseConversation;

	constructor(data: TBaseDialogCtor) {
		this.activity = data.activity;
		this.contact = data.contact;
		this.conversation = data.conversation;
	}
}
