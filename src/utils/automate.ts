// Interfaces.
import { IUtilsAutomate } from '../interfaces/utils/automate';
import { TCxperiumServiceParams } from '../types/cxperium/service';

// Services.
import ServiceAutomate from '../services/automate';

// Datas.
import DataGeneral from '../data/general';

// Export default module.
export class UtilAutomate implements IUtilsAutomate {
	apiKey!: string;
	callbackUrl!: string;
	serviceAutomate!: ServiceAutomate;
	public initAutomateService() {
		const params: TCxperiumServiceParams = {
			apikey: this.apiKey,
			callbackUrl: this.callbackUrl,
			baseUrl: DataGeneral.cxperiumBaseUrl,
		};
		this.serviceAutomate = new ServiceAutomate(params);
	}
}
