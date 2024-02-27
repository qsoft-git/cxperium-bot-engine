// import * as crypto from 'crypto';

// export default class {
// 	private rsa: crypto.KeyObject;

// 	constructor() {
// 		this.rsa = crypto.generateKeyPairSync('rsa', {
// 			modulusLength: 2048,
// 			publicKeyEncoding: {
// 				type: 'spki',
// 				format: 'pem',
// 			},
// 			privateKeyEncoding: {
// 				type: 'pkcs1',
// 				format: 'pem',
// 			},
// 		});
// 	}

// 	public importPrivateKey(privateKeyPem: string): void {
// 		this.rsa = crypto.createPrivateKey(privateKeyPem);
// 	}

// 	public importPublicKey(publicKeyPem: string): void {
// 		this.rsa = crypto.createPublicKey(publicKeyPem);
// 	}

// 	public encrypt(data: string): string {
// 		const buffer = Buffer.from(data, 'utf8');
// 		const encrypted = crypto.publicEncrypt(this.rsa, buffer, {
// 			oaepHash: 'sha1',
// 			padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
// 		});
// 		return encrypted.toString('base64');
// 	}

// 	public decrypt(data: string): string {
// 		const buffer = Buffer.from(data, 'base64');
// 		const decrypted = crypto.privateDecrypt(this.rsa, buffer, {
// 			oaepHash: 'sha256',
// 			padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
// 		});
// 		return decrypted.toString('utf8');
// 	}
// }
