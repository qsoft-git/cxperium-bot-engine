// Interfaces.
import { ISrcIndexConfig } from '../src-index';

// Services.
import ServiceCxperiumMain from '../../services/cxperium/main';

export interface IUtilsCxperium {
	apiKey: string;
	callbackUrl: string;
	serviceCxperiumMain: ServiceCxperiumMain;
	initCxperiumProperties: (data: ISrcIndexConfig) => void;
}
