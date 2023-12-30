import ServiceCxperiumConfiguration from '../../services/cxperium/configuration';
import { TSrcIndexConfig } from '../../types/src-index';

export interface IUtilsWhatsApp {
	serviceCxperiumConfiguration: ServiceCxperiumConfiguration;
	initWhatsAppProperties: (data: TSrcIndexConfig) => void;
	initWhatsAppService: () => void;
}
