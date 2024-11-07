// ? Types.
import { TCxperiumEnvironment } from '../types/configuration/environment';

// ? Services.
import ServiceCxperiumConfiguration from '../services/cxperium/configuration';

export default class UtilConfig {
	private static instance: UtilConfig;
	public environment!: TCxperiumEnvironment;
	serviceCxperiumConfiguration!: ServiceCxperiumConfiguration;

	constructor() {}

	public getInstance(): UtilConfig {
		if (!UtilConfig.instance) {
			UtilConfig.instance = new UtilConfig();
		}
		return UtilConfig.instance;
	}
}
