// import * as crypto from 'crypto';
// import * as fs from 'fs';

// interface FlowRequest {
// 	// Properties of FlowRequest
// }

// class FlowService {
// 	private static instance: FlowService;
// 	private privatePem: string;

// 	private constructor() {}

// 	public static getInstance(): FlowService {
// 		if (!FlowService.instance) {
// 			FlowService.instance = new FlowService();
// 			FlowService.instance.loadPrivatePemFile();
// 		}
// 		return FlowService.instance;
// 	}

// 	private loadPrivatePemFile() {
// 		const assemblyName = process.argv[1]; // Assuming assembly name is the first command-line argument
// 		const resourceName = assemblyName + '.private.pem';

// 		const stream = fs.createReadStream(resourceName);
// 		let data = '';
// 		stream.on('data', (chunk) => {
// 			data += chunk;
// 		});
// 		stream.on('end', () => {
// 			this.privatePem = data;
// 		});
// 	}

// 	public decryptRequest(
// 		encryptedFlowData: string,
// 		encryptedAesKey: string,
// 		initialVector: string,
// 	): FlowRequest {
// 		const rsaHelper = new crypto.RSAPrivateKey();
// 		rsaHelper.importKey(this.privatePem);
// 		const decryptedAesKey = rsaHelper.decrypt(encryptedAesKey, 'base64');

// 		const base64InitialVector = Buffer.from(initialVector, 'base64');

// 		const decipher = crypto.createDecipheriv(
// 			'aes-256-gcm',
// 			decryptedAesKey,
// 			base64InitialVector,
// 		);
// 		let decryptedData = decipher.update(
// 			encryptedFlowData,
// 			'base64',
// 			'utf8',
// 		);
// 		decryptedData += decipher.final('utf8');

// 		const request = JSON.parse(decryptedData) as FlowRequest;
// 		request.decryptedAesKey = decryptedAesKey;
// 		request.initialVector = base64InitialVector;

// 		return request;
// 	}

// 	public encryptedResponse(
// 		responseJson: string,
// 		aesKey: Buffer,
// 		initialVector: Buffer,
// 	): string {
// 		const cipher = crypto.createCipheriv(
// 			'aes-256-gcm',
// 			aesKey,
// 			initialVector,
// 		);
// 		let encryptedData = cipher.update(responseJson, 'utf8', 'base64');
// 		encryptedData += cipher.final('base64');

// 		return encryptedData;
// 	}
// }

// export default FlowService;
