// Datas.
import DataGeneral from '../data/general';

// Interfaces.
import { IUtilsCxperium } from '../interfaces/utils/cxperium';
import { ISrcIndexConfig } from '../interfaces/src-index';
import { ICxperiumParams } from '../interfaces/services/cxperium';

// Services.
import ServiceCxperiumMain from '../services/cxperium/main';
import ServiceCxperiumContact from '../services/cxperium/contact';
import ServiceCxperiumUser from '../services/cxperium/user';

// Export default module.
export class UtilCxperium implements IUtilsCxperium {
	apiKey!: string;
	callbackUrl!: string;
	serviceCxperiumMain!: ServiceCxperiumMain;
	serviceCxperiumContact!: ServiceCxperiumContact;
	serviceCxperiumUser!: ServiceCxperiumUser;

	public initCxperiumProperties({
		apiKey: _apiKey,
		callbackUrl: _callbackUrl,
	}: ISrcIndexConfig): void {
		this.apiKey = _apiKey;
		this.callbackUrl = _callbackUrl;

		if (!this.apiKey) {
			throw new Error('API_KEY is not set.');
		}
	}

	public initServiceMain() {
		const params: ICxperiumParams = {
			apikey: this.apiKey,
			callbackUrl: this.callbackUrl,
			baseUrl: DataGeneral.cxperiumBaseUrl,
		};
		this.serviceCxperiumMain = new ServiceCxperiumMain(params);
		this.serviceCxperiumContact = new ServiceCxperiumContact(params);
		this.serviceCxperiumUser = new ServiceCxperiumUser(params);
	}
}
