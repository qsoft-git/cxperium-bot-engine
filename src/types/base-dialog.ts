// Types.
import { TActivity } from './whatsapp/activity';
import { TCxperiumContact } from '../types/cxperium/contact';
import { TCxperiumServices } from '../types/cxperium/service';

// Services.
import ServiceDialog from '../services/dialog';
import BaseConversation from '../services/conversation';
import { TWhatsAppServices } from './whatsapp/service';
import { TAutomateServices } from './automate/automate';

// Types.
export type TAppLocalsServices = {
	cxperium: TCxperiumServices;
	whatsapp: TWhatsAppServices;
	automate: TAutomateServices;
	dialog: ServiceDialog;
};

export type TBaseDialogDialogFileParams = {
	name: string;
	path: string;
	place: string;
};

export type TBaseDialogCtor = {
	contact: TCxperiumContact;
	activity: TActivity;
	conversation: BaseConversation;
	dialogFileParams: TBaseDialogDialogFileParams;
	services: TAppLocalsServices;
};
