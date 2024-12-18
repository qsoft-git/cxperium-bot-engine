// ? Node modules.
import * as crypto from 'crypto';

export interface DecryptedRequest {
	decryptedBody: any;
	aesKeyBuffer: Buffer;
	initialVectorBuffer: Buffer;
}

export const decryptRequest = (
	body: any,
	privatePem: string,
): DecryptedRequest => {
	const { encrypted_aes_key, encrypted_flow_data, initial_vector } = body;

	// Decrypt the AES key created by the client
	const decryptedAesKey = crypto.privateDecrypt(
		{
			key: crypto.createPrivateKey({ key: privatePem }),
			padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
			oaepHash: 'sha256',
		},
		Buffer.from(encrypted_aes_key, 'base64') as any,
	);

	// Decrypt the Flow data
	const flowDataBuffer = Buffer.from(encrypted_flow_data, 'base64');
	const initialVectorBuffer = Buffer.from(initial_vector, 'base64');

	const TAG_LENGTH = 16;
	const encrypted_flow_data_body = flowDataBuffer.subarray(0, -TAG_LENGTH);
	const encrypted_flow_data_tag = flowDataBuffer.subarray(-TAG_LENGTH);

	const decipher = crypto.createDecipheriv(
		'aes-128-gcm',
		decryptedAesKey as any,
		initialVectorBuffer as any,
	);
	decipher.setAuthTag(encrypted_flow_data_tag as any);

	const decryptedJSONString = Buffer.concat([
		decipher.update(encrypted_flow_data_body as any) as any,
		decipher.final(),
	]).toString('utf-8');

	return {
		decryptedBody: JSON.parse(decryptedJSONString),
		aesKeyBuffer: decryptedAesKey,
		initialVectorBuffer,
	};
};

export const encryptResponse = (
	response: any,
	aesKeyBuffer: Buffer,
	initialVectorBuffer: Buffer,
): string => {
	// Flip the initialization vector
	const flipped_iv = Buffer.alloc(initialVectorBuffer.length);
	for (let i = 0; i < initialVectorBuffer.length; i++) {
		flipped_iv[i] = ~initialVectorBuffer[i];
	}

	// Encrypt the response data
	const cipher = crypto.createCipheriv(
		'aes-128-gcm',
		aesKeyBuffer as any,
		flipped_iv as any,
	);
	return Buffer.concat([
		cipher.update(JSON.stringify(response), 'utf-8') as any,
		cipher.final(),
		cipher.getAuthTag(),
	]).toString('base64');
};
