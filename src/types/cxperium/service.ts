// Services.
import ServiceCxperiumMain from '../../services/cxperium/main';
import ServiceCxperiumContact from '../../services/cxperium/contact';
import ServiceCxperiumUser from '../../services/cxperium/user';
import ServiceCxperiumIntent from '../../services/cxperium/intent';
import ServiceCxperiumReport from '../../services/cxperium/report';
import ServiceCxperiumTicket from '../../services/cxperium/ticket';
import ServiceCxperiumSession from '../../services/cxperium/session';
import ServiceCxperiumConversation from '../../services/cxperium/conversation';
import ServiceCxperiumLanguage from '../../services/cxperium/language';
import ServiceCxperiumMessage from '../../services/cxperium/message';
import ServiceCxperiumConfiguration from '../../services/cxperium/configuration';

// Types.
export type TCxperiumServices = {
	main: ServiceCxperiumMain;
	contact: ServiceCxperiumContact;
	user: ServiceCxperiumUser;
	intent: ServiceCxperiumIntent;
	report: ServiceCxperiumReport;
	ticket: ServiceCxperiumTicket;
	session: ServiceCxperiumSession;
	conversation: ServiceCxperiumConversation;
	language: ServiceCxperiumLanguage;
	message: ServiceCxperiumMessage;
	configuration: ServiceCxperiumConfiguration;
};

export type TCxperiumServiceParams = {
	apikey: string;
	callbackUrl: string;
	baseUrl: string;
};
