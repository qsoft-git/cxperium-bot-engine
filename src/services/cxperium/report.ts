// ? Fetch Retry.
import fetchRetry from '../fetch';

// ? Services.
import ServiceCxperium from '.';

// ? Types.
import { TCxperiumServiceParams } from '../../types/cxperium/service';

export default class extends ServiceCxperium {
	constructor(data: TCxperiumServiceParams) {
		super(data);
	}

	async sendAssistantReport(
		phone: string,
		intent: string,
		messageStr: string,
		nlpType: string,
	): Promise<void> {
		try {
			const body = {
				phone: phone,
				intentName: intent,
				message: messageStr,
				nlp: nlpType,
			};

			await fetchRetry(this.baseUrl + '/api/assistant/report', {
				method: 'POST',
				body: JSON.stringify(body),
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			});

			console.info('Intent report is sent to Cxperium successfully');
		} catch (error) {
			console.info('Problem occurred during sending report to cxperium');
			console.info(
				`Phone:${phone}, Intent:${intent}, Message:${messageStr}, NlpType:${nlpType}`,
			);
		}
	}
}
