// Types.
import { TActivity } from '../types/activity';
import { TCxperiumContact } from '../types/cxperium/contact';
import { TCxperiumServices } from '../types/cxperium/service';

// Services.
import ServiceDialog from '../services/dialog';
import BaseConversation from '../services/conversation';

// Types.
export type TAppLocalsServices = {
	cxperium: TCxperiumServices;
	dialog: ServiceDialog;
};

export type TBaseDialogCtor = {
	contact: TCxperiumContact;
	activity: TActivity;
	conversation: BaseConversation;
	dialogPath: string;
	services: TAppLocalsServices;
};
