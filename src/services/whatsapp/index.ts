// Types.
import ServiceCxperiumConfiguration from '../cxperium/configuration';

export default class {
	CONFIGURATION: ServiceCxperiumConfiguration;

	constructor(serviceCxperiumConfiguration: ServiceCxperiumConfiguration) {
		this.CONFIGURATION = serviceCxperiumConfiguration;
	}

	public get configuration(): ServiceCxperiumConfiguration {
		return this.CONFIGURATION;
	}
}
