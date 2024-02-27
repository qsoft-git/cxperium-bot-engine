import * as crypto from 'crypto';

export interface DecryptedRequest {
	decryptedBody: any;
	aesKeyBuffer: Buffer;
	initialVectorBuffer: Buffer;
}

export class FlowEndpointException extends Error {
	statusCode: number;

	constructor(statusCode: number, message: string) {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = statusCode;
	}
}

export const decryptRequest = (
	body: any,
	privatePem: string,
	passphrase: string,
): DecryptedRequest => {
	const { encrypted_aes_key, encrypted_flow_data, initial_vector } = body;

	try {
		const privateKey = crypto.createPrivateKey({
			key: privatePem,
			passphrase,
		});
		const decryptedAesKey = crypto.privateDecrypt(
			{
				key: privateKey,
				padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
				oaepHash: 'sha256',
			},
			Buffer.from(encrypted_aes_key, 'base64'),
		);

		const flowDataBuffer = Buffer.from(encrypted_flow_data, 'base64');
		const initialVectorBuffer = Buffer.from(initial_vector, 'base64');

		const TAG_LENGTH = 16;
		const encrypted_flow_data_body = flowDataBuffer.subarray(
			0,
			-TAG_LENGTH,
		);
		const encrypted_flow_data_tag = flowDataBuffer.subarray(-TAG_LENGTH);

		const decipher = crypto.createDecipheriv(
			'aes-128-gcm',
			decryptedAesKey,
			initialVectorBuffer,
		);
		decipher.setAuthTag(encrypted_flow_data_tag);

		const decryptedJSONString = Buffer.concat([
			decipher.update(encrypted_flow_data_body),
			decipher.final(),
		]).toString('utf-8');

		return {
			decryptedBody: JSON.parse(decryptedJSONString),
			aesKeyBuffer: decryptedAesKey,
			initialVectorBuffer,
		};
	} catch (error) {
		console.error(error);
		throw new FlowEndpointException(
			421,
			'Failed to decrypt the request. Please verify your private key.',
		);
	}
};

export const encryptResponse = (
	response: any,
	aesKeyBuffer: Buffer,
	initialVectorBuffer: Buffer,
): string => {
	// flip initial vector
	const flipped_iv = Buffer.alloc(initialVectorBuffer.length);
	for (let i = 0; i < initialVectorBuffer.length; i++) {
		flipped_iv[i] = ~initialVectorBuffer[i];
	}

	// encrypt response data
	const cipher = crypto.createCipheriv(
		'aes-128-gcm',
		aesKeyBuffer,
		flipped_iv,
	);
	return Buffer.concat([
		cipher.update(JSON.stringify(response), 'utf-8'),
		cipher.final(),
		cipher.getAuthTag(),
	]).toString('base64');
};
