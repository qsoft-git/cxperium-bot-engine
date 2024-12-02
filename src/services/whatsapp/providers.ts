import { isValidNumber, checkAccessToken } from '../utils/provider';

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

	const requestUrl = `https://sinan-provider.qsoft.space/${
		process.env.VERSION || 'v19.0'
	}/${phoneNumberId}/messages`;
	const reviveBody = { ...body, messaging_product: 'whatsapp' };
	delete reviveBody?.recipient_type;

	const fetchResponse = await fetch(requestUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + config.key,
		},
		body: JSON.stringify(reviveBody),
	});

	if (!fetchResponse.ok) {
		if (fetchResponse.status == 404) {
			throw new Error('Provider is not reachable!');
		}

		throw new Error(`HTTP error! status: ${fetchResponse.status}`);
	}

	const textResponse = await fetchResponse.text();
	const response = textResponse ? JSON.parse(textResponse) : {};

	console.log(
		`Message with ${response?.botMessageId} id is sent to Meta! 🚀`,
	);

	return response?.botMessageId;
};
