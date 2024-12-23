// ? Types.
import BaseConversation from '../services/conversation';
import { TAppLocalsServices } from './base-dialog';
import { TCxperiumContact } from './cxperium/contact';
import { TActivity } from './whatsapp/activity';

type Dialog = {
	contact: TCxperiumContact;
	activity: TActivity;
	conversation: BaseConversation;
	services: TAppLocalsServices;
};

export { Dialog };
