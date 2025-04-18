import { isValidNumber, checkAccessToken } from '../utils/provider';
import axios from 'axios';
import axiosRetry from 'axios-retry';

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
	axiosRetry(axios, {
		retries: 3,
		retryDelay: (retryCount) => {
			console.log(`⏳ Retry attempt: ${retryCount}`);
			return retryCount * 1000; // 1s, 2s, 3s
		},
		retryCondition: (error) => {
			const isTimeout =
				error.code === 'ECONNABORTED' ||
				error.code === 'UND_ERR_CONNECT_TIMEOUT';

			return axiosRetry.isRetryableError(error) || isTimeout;
		},
	});

	// Request interceptor
	axios.interceptors.request.use(
		(config) => {
			console.log('📤 Axios request is about to be sent:', {
				url: config.url,
				method: config.method,
				timeout: config.timeout,
			});
			return config;
		},
		(error) => {
			console.error('❌ Request Error BEFORE sending:', error);
			return Promise.reject(error);
		},
	);

	//  Response interceptor
	axios.interceptors.response.use(
		(response) => {
			console.log('Response received:', {
				status: response.status,
				url: response.config.url,
			});
			return response;
		},
		(error) => {
			console.error('❌ Response error AFTER request sent:', {
				code: error.code,
				message: error.message,
				url: error.config?.url,
			});
			return Promise.reject(error);
		},
	);

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
			}
			console.error(`HTTP error! status: ${error.response.status}`);

			console.error('🔴 Full Error Detail:', {
				message: error.message,
				stack: error.stack,
				name: error.name,
				responseStatus: error.response.status,
				responseData: error.response.data,
				responseHeaders: error.response.headers,
				config: error.config,
			});
		} else if (
			error.code === 'ECONNABORTED' ||
			error.code === 'UND_ERR_CONNECT_TIMEOUT'
		) {
			console.error('Request timed out!:', {
				message: error.message,
				stack: error.stack,
				name: error.name,
				code: error.code,
			});
		} else {
			console.error('Error in provider:', error.message);

			console.error('🔴 Full Error Detail (non-response):', {
				message: error.message,
				stack: error.stack,
				name: error.name,
				code: error.code,
			});
		}
		return 'Error :' + error.message;
	}
};
