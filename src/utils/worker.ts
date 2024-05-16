// Datas.
import DataGeneral from '../data/general';

// Interfaces.
import { IUtilsWorker } from '../interfaces/utils/worker';

// Services.
import { TCxperiumServiceParams } from '../types/cxperium/service';
import SessionWorker from '../workers/session';

// Types.
import { TSrcIndexConfig } from '../types/src-index';

export class UtilWorker implements IUtilsWorker {
	serviceSessionWorker!: SessionWorker;

	public initWorkers(data: TSrcIndexConfig): void {
		const params: TCxperiumServiceParams = {
			apikey: data.apiKey,
			callbackUrl: data.callbackUrl,
			baseUrl: DataGeneral.cxperiumBaseUrl,
		};

		this.serviceSessionWorker = new SessionWorker(params);
	}
}
