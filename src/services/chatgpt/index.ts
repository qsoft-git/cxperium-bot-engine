// Services.
import ServiceCxperiumConfiguration from '../cxperium/configuration';

// Types.
import { TChatGPTConfig } from '../../types/configuration/chatgpt';

export default class {
	private chatGptConfig!: TChatGPTConfig;
	private serviceCxperiumConfig: ServiceCxperiumConfiguration;

	constructor(serviceCxperiumConfiguration: ServiceCxperiumConfiguration) {
		this.serviceCxperiumConfig = serviceCxperiumConfiguration;
	}
}
