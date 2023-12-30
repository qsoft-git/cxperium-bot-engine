// Node modules.
import fetch from 'node-fetch';

// Services.
import ServiceCxperium from '.';

// Types.
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
		const intentName = intent ? true : '';
		const body = {
			phone: phone,
			intentName: intentName,
			message: messageStr,
			nlp: nlpType,
		};

		const response = await fetch(this.baseUrl + '/api/assistant/report', {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'content-type': 'application/json',
				apiKey: this.apiKey,
			},
		});

		if (response && response.status == 201) {
			console.info('Intent report is sent to Cxperium successfully');
		} else {
			console.info('Problem occurred during sending report to cxperium');
			console.info(
				`Phone:${phone}, Intent:${intentName}, Message:${messageStr}, NlpType:${nlpType}`,
			);
		}
	}
}
