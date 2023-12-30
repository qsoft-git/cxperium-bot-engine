// Datas.
import DataGeneral from '../data/general';

// Interfaces.
import { IUtilsWhatsApp } from '../interfaces/utils/whatsapp';

// Services.
import ServiceCxperiumConfiguration from '../services/cxperium/configuration';
import ServiceWhatsAppMessage from '../services/whatsapp/message';
import ServiceWhatsApp from '../services/whatsapp/index';

// Types.
import { TCxperiumServiceParams } from '../types/cxperium/service';
import { TSrcIndexConfig } from '../types/src-index';

// Export default module.
export class UtilWhatsApp implements IUtilsWhatsApp {
	serviceCxperiumConfiguration!: ServiceCxperiumConfiguration;
	serviceWhatsAppMessage!: ServiceWhatsAppMessage;
	serviceWhatsApp!: ServiceWhatsApp;

	public initWhatsAppProperties(data: TSrcIndexConfig): void {
		const params: TCxperiumServiceParams = {
			apikey: data.apiKey,
			callbackUrl: data.callbackUrl,
			baseUrl: DataGeneral.cxperiumBaseUrl,
		};

		this.serviceCxperiumConfiguration = new ServiceCxperiumConfiguration(
			params,
		);
	}

	public initWhatsAppService() {
		this.serviceWhatsApp = new ServiceWhatsApp(
			this.serviceCxperiumConfiguration,
		);
		this.serviceWhatsAppMessage = new ServiceWhatsAppMessage(
			this.serviceCxperiumConfiguration,
		);
	}
}
