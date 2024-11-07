// ? Types.
import { TSrcIndexConfig } from '../../types/src-index';

// ? Services.
import ServiceCxperiumConfiguration from '../../services/cxperium/configuration';

export interface IUtilsWhatsApp {
	serviceCxperiumConfiguration: ServiceCxperiumConfiguration;
	initWhatsAppProperties: (data: TSrcIndexConfig) => void;
	initWhatsAppService: () => void;
}
