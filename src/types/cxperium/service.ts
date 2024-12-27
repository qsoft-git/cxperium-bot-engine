// Services.
import ServiceCxperiumMain from '../../services/cxperium/main';
import ServiceCxperiumContact from '../../services/cxperium/contact';
import ServiceCxperiumUser from '../../services/cxperium/user';
import ServiceCxperiumIntent from '../../services/cxperium/intent';
import ServiceCxperiumReport from '../../services/cxperium/report';
import ServiceCxperiumTicket from '../../services/cxperium/ticket';
import ServiceCxperiumSession from '../../services/cxperium/session';
import ServiceCxperiumChat from '../../services/cxperium/chat';
import ServiceCxperiumLanguage from '../../services/cxperium/language';
import ServiceCxperiumMessage from '../../services/cxperium/message';
import ServiceCxperiumConfiguration from '../../services/cxperium/configuration';
import ServiceCxperiumTransfer from '../../services/cxperium/transfer';
import ServiceCxperiumShoppingCart from '../../services/cxperium/shopping-cart';

// Types.
export type TCxperiumServices = {
	main: ServiceCxperiumMain;
	contact: ServiceCxperiumContact;
	user: ServiceCxperiumUser;
	intent: ServiceCxperiumIntent;
	report: ServiceCxperiumReport;
	ticket: ServiceCxperiumTicket;
	session: ServiceCxperiumSession;
	chat: ServiceCxperiumChat;
	language: ServiceCxperiumLanguage;
	message: ServiceCxperiumMessage;
	configuration: ServiceCxperiumConfiguration;
	transfer: ServiceCxperiumTransfer;
	shoppingCart: ServiceCxperiumShoppingCart;
};

export type TCxperiumServiceParams = {
	apikey: string;
	callbackUrl: string;
	baseUrl: string;
};
