import { CronJob } from 'cron';

// Services.
import ServiceCxperiumSession from '../services/cxperium/session';
import { TCxperiumServiceParams } from '../types/cxperium/service';

export default class {
	cronJob!: CronJob;
	serviceCxperiumSession!: ServiceCxperiumSession;

	constructor(data: TCxperiumServiceParams) {
		this.serviceCxperiumSession = new ServiceCxperiumSession(data);
		this.cronJob = new CronJob('* * * * *', async () => {
			try {
				await this.sessionCheck();
			} catch (e) {
				console.error(e);
			}
		});

		// Start job
		if (!this.cronJob.running) {
			console.log(`ACTIVE SESSION CRONJOB STARTED SUCCESSFULLY`);
			this.cronJob.start();
		}
	}

	async sessionCheck() {
		await this.serviceCxperiumSession.closeActiveSessionsWithTransfer();
	}
}
