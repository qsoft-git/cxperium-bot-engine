// Types.
import { TActivity } from '../types/activity';
import { TCxperiumContact } from '../types/cxperium/contact';

// Services.
import BaseConversation from '../services/conversation';

export type TBaseDialogCtor = {
	contact: TCxperiumContact;
	activity: TActivity;
	conversation: BaseConversation;
};
