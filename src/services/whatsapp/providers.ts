import { isValidNumber, checkAccessToken } from '../utils/provider';
import axios from 'axios';

export const dialog360Provider = async (
	body: any,
	endpoint: string,
	config: any,
): Promise<any> => {
	const response = await fetch(`${config.wabaUrl}/${endpoint}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'D360-API-KEY': config.key,
		},
		body: JSON.stringify(body),
	}).then((response) => response.json());

	return response;
};

export const cloudProvider = async (
	body: any,
	_endpoint: string,
	config: any,
): Promise<string> => {
	const phoneNumberId = config.phoneNumberId;

	if (!phoneNumberId || !isValidNumber(phoneNumberId)) {
		throw new Error(
			'Phone number id is incorrect. Check it under the Cxperium/Whatsapp Configuration menu!',
		);
	}

	if (!config.key || !(await checkAccessToken(config.key))) {
		throw new Error(
			'Access token is invalid. Check it under the Cxperium/Whatsapp Configuration menu!',
		);
	}
	try {
		const requestUrl = `${
			process.env.PROVIDER_BASE_URL || 'https://provider.cxperium.com'
		}/${process.env.VERSION || 'v21.0'}/${phoneNumberId}/messages`;

		const reviveBody = { ...body, messaging_product: 'whatsapp' };
		delete reviveBody?.recipient_type;
		delete reviveBody?.interactive?.body?.type;

		const axiosResponse = await axios.post(requestUrl, reviveBody, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + config.key,
				'X-Forwarded-for': 'CXPERIUM_BOT',
			},
			timeout: 50000,
			responseType: 'text',
		});

		const textResponse = axiosResponse.data;
		const response = textResponse ? JSON.parse(textResponse) : {};

		console.log(
			`Message with ${
				response?.botMessageId || textResponse
			} id is sent to Meta! 🚀`,
		);

		return response?.botMessageId;
	} catch (error: any) {
		if (error.response) {
			if (error.response.status === 404) {
				console.error('Provider is not reachable! (404)');
				throw new Error('Provider is not reachable!');
			}

			console.error(`HTTP error! status: ${error.response.status}`);
			throw new Error(`HTTP error! status: ${error.response.status}`);
		} else if (error.code === 'ECONNABORTED') {
			console.error('Request timed out!');
			throw new Error('Request timed out!');
		} else {
			console.error('Error in provider:', error.message);
			throw new Error('Error in provider: ' + error.message);
		}
	}
};
