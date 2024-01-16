import * as CryptoJS from 'crypto-js';

export default class {
	public static decrypt(ciphertext: string): string {
		const encryptKey = CryptoJS.enc.Utf8.parse('4756389203948576');
		const iv = CryptoJS.enc.Utf8.parse('05e3391c94a74f0099d9f6c7c9365944');

		if (process.env.NODE_ENV == 'development') return 'sinan.coskun';

		// const ciphertext = CryptoJS.AES.encrypt('sinan.coskun', encryptKey, {
		// 	iv: iv,
		// }).toString();

		const decryptedData = CryptoJS.AES.decrypt(ciphertext, encryptKey, {
			iv: iv,
		});

		const result = decryptedData.toString(CryptoJS.enc.Utf8);

		return result;
	}
}
