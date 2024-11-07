// ? Services.
import ServiceWhatsApp from './index';
import ServiceCxperiumConfiguration from '../cxperium/configuration';

export default class extends ServiceWhatsApp {
	constructor(serviceCxperiumConfiguration: ServiceCxperiumConfiguration) {
		super(serviceCxperiumConfiguration);
	}
}
