// ? Types.
import { TActivity } from './whatsapp/activity';
import { TCxperiumContact } from '../types/cxperium/contact';
import { TCxperiumServices } from '../types/cxperium/service';

// ? Services.
import ServiceDialog from '../services/dialog';
import BaseConversation from '../services/conversation';
import { TWhatsAppServices } from './whatsapp/service';
import Logger from '../helpers/winston-loki';

export type TAppLocalsServices = {
	cxperium: TCxperiumServices;
	whatsapp: TWhatsAppServices;
	dialog: ServiceDialog;
	loki: Logger;
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
