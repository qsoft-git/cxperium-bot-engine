// Types.
import { TActivity } from './whatsapp/activity';
import { TCxperiumContact } from '../types/cxperium/contact';
import { TCxperiumServices } from '../types/cxperium/service';

// Services.
import ServiceDialog from '../services/dialog';
import BaseConversation from '../services/conversation';
import { TWhatsAppServices } from './whatsapp/service';

// Types.
export type TAppLocalsServices = {
	cxperium: TCxperiumServices;
	whatsapp: TWhatsAppServices;
	dialog: ServiceDialog;
};

export type TBaseDialogCtor = {
	contact: TCxperiumContact;
	activity: TActivity;
	conversation: BaseConversation;
	dialogPath: string;
	services: TAppLocalsServices;
};
