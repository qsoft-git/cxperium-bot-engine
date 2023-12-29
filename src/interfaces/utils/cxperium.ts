// Interfaces.
import { ISrcIndexConfig } from '../src-index';

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

export interface IUtilsCxperium {
	apiKey: string;
	callbackUrl: string;
	serviceCxperiumMain: ServiceCxperiumMain;
	serviceCxperiumContact: ServiceCxperiumContact;
	serviceCxperiumUser: ServiceCxperiumUser;
	serviceCxperiumIntent: ServiceCxperiumIntent;
	serviceCxperiumReport: ServiceCxperiumReport;
	serviceCxperiumTicket: ServiceCxperiumTicket;
	serviceCxperiumSession: ServiceCxperiumSession;
	serviceCxperiumConversation: ServiceCxperiumConversation;
	serviceCxperiumLanguage: ServiceCxperiumLanguage;
	initCxperiumProperties: (data: ISrcIndexConfig) => void;
	initCxperiumService: () => void;
}
