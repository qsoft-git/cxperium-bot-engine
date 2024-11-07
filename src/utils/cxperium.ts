// ? Datas.
import DataGeneral from '../data/general';

// ? Types.
import { TSrcIndexConfig } from '../types/src-index';

// ? Interfaces.
import { IUtilsCxperium } from '../interfaces/utils/cxperium';
import { TCxperiumServiceParams } from '../types/cxperium/service';

// ? Services.
import ServiceCxperiumMain from '../services/cxperium/main';
import ServiceCxperiumContact from '../services/cxperium/contact';
import ServiceCxperiumUser from '../services/cxperium/user';
import ServiceCxperiumIntent from '../services/cxperium/intent';
import ServiceCxperiumReport from '../services/cxperium/report';
import ServiceCxperiumTicket from '../services/cxperium/ticket';
import ServiceCxperiumSession from '../services/cxperium/session';
import ServiceCxperiumConversation from '../services/cxperium/conversation';
import ServiceCxperiumLanguage from '../services/cxperium/language';
import ServiceCxperiumMessage from '../services/cxperium/message';
import ServiceCxperiumConfiguration from '../services/cxperium/configuration';
import ServiceCxperiumTransfer from '../services/cxperium/transfer';
import ServiceCxperiumShoppingCart from '../services/cxperium/shopping-cart';

// ? Export default module.
export class UtilCxperium implements IUtilsCxperium {
	apiKey!: string;
	callbackUrl!: string;
	serviceCxperiumMain!: ServiceCxperiumMain;
	serviceCxperiumContact!: ServiceCxperiumContact;
	serviceCxperiumUser!: ServiceCxperiumUser;
	serviceCxperiumIntent!: ServiceCxperiumIntent;
	serviceCxperiumReport!: ServiceCxperiumReport;
	serviceCxperiumTicket!: ServiceCxperiumTicket;
	serviceCxperiumSession!: ServiceCxperiumSession;
	serviceCxperiumConversation!: ServiceCxperiumConversation;
	serviceCxperiumLanguage!: ServiceCxperiumLanguage;
	serviceCxperiumMessage!: ServiceCxperiumMessage;
	serviceCxperiumConfiguration!: ServiceCxperiumConfiguration;
	serviceCxperiumTransfer!: ServiceCxperiumTransfer;
	serviceCxperiumShoppingCart!: ServiceCxperiumShoppingCart;

	public initCxperiumProperties({
		apiKey: _apiKey,
		callbackUrl: _callbackUrl,
	}: TSrcIndexConfig): void {
		this.apiKey = _apiKey;
		this.callbackUrl = _callbackUrl;

		if (!this.apiKey) {
			throw new Error('API_KEY is not set.');
		}
	}

	public initCxperiumService() {
		const params: TCxperiumServiceParams = {
			apikey: this.apiKey,
			callbackUrl: this.callbackUrl,
			baseUrl: DataGeneral.cxperiumBaseUrl,
		};

		this.serviceCxperiumMain = new ServiceCxperiumMain(params);
		this.serviceCxperiumContact = new ServiceCxperiumContact(params);
		this.serviceCxperiumUser = new ServiceCxperiumUser(params);
		this.serviceCxperiumIntent = new ServiceCxperiumIntent(params);
		this.serviceCxperiumReport = new ServiceCxperiumReport(params);
		this.serviceCxperiumTicket = new ServiceCxperiumTicket(params);
		this.serviceCxperiumSession = new ServiceCxperiumSession(params);
		this.serviceCxperiumConversation = new ServiceCxperiumConversation(
			params,
		);
		this.serviceCxperiumLanguage = new ServiceCxperiumLanguage(params);
		this.serviceCxperiumMessage = new ServiceCxperiumMessage(params);
		this.serviceCxperiumConfiguration = new ServiceCxperiumConfiguration(
			params,
		);
		this.serviceCxperiumTransfer = new ServiceCxperiumTransfer(params);
		this.serviceCxperiumShoppingCart = new ServiceCxperiumShoppingCart(
			params,
		);
	}
}
