// Interfaces.
import { IUtilsAutomate } from '../interfaces/utils/automate';
import { TCxperiumServiceParams } from '../types/cxperium/service';

// Services.
import ServiceAutomateUser from '../services/automate/user';
import ServiceAutomateApi from '../services/automate/api';

// Datas.
import DataGeneral from '../data/general';

// Export default module.
export class UtilAutomate implements IUtilsAutomate {
	apiKey!: string;
	callbackUrl!: string;
	serviceAutomateUser!: ServiceAutomateUser;
	serviceAutomateApi!: ServiceAutomateApi;
	public initAutomateService() {
		const params: TCxperiumServiceParams = {
			apikey: this.apiKey,
			callbackUrl: this.callbackUrl,
			baseUrl: DataGeneral.cxperiumBaseUrl,
		};
		this.serviceAutomateUser = new ServiceAutomateUser(params);
		this.serviceAutomateApi = new ServiceAutomateApi(params);
	}
}
