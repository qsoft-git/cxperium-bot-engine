import axios from 'axios';
import crypto from 'crypto';

interface MediaFile {
	file_name: string;
	media_id: string;
	mime_type: string;
	data: Buffer;
	cdn_url?: string;
	encryption_metadata?: EncryptionMetadata;
}

interface EncryptionMetadata {
	encryption_key: string;
	hmac_key: string;
	iv: string;
	plaintext_hash: string;
	encrypted_hash: string;
}

export async function decryptMedia(files: MediaFile[]): Promise<MediaFile[]> {
	const mediaFiles: MediaFile[] = [];

	for (const file of files) {
		const fileName = file.file_name;
		const mediaId = file.media_id;
		const cdnUrl = file.cdn_url!;
		const encryptionMetadata: EncryptionMetadata =
			file.encryption_metadata!;

		const fileBytes = await decryptMediaContent(
			cdnUrl,
			encryptionMetadata.encrypted_hash,
			encryptionMetadata.iv,
			encryptionMetadata.encryption_key,
			encryptionMetadata.hmac_key,
			encryptionMetadata.plaintext_hash,
		);

		const mimeType = 'application/octet-stream'; // Adjust MIME detection if necessary.

		const mediaFile: MediaFile = {
			file_name: fileName,
			media_id: mediaId,
			mime_type: mimeType,
			data: fileBytes,
		};

		mediaFiles.push(mediaFile);
	}

	return mediaFiles;
}

async function decryptMediaContent(
	cdnUrl: string,
	encryptedHash: string,
	iv: string,
	encryptionKey: string,
	hmacKey: string,
	plaintextHash: string,
): Promise<Buffer> {
	const response = await axios.get(cdnUrl, { responseType: 'arraybuffer' });
	const cdnFile = Buffer.from(response.data);

	const cdnFileHash = crypto
		.createHash('sha256')
		.update(cdnFile as any)
		.digest('base64');
	if (cdnFileHash !== encryptedHash) {
		throw new Error('SHA256 hash mismatch for cdn_file.');
	}

	const cipherText = cdnFile.slice(0, cdnFile.length - 10);
	const hmac10 = cdnFile.slice(cdnFile.length - 10);

	const hmac = crypto.createHmac(
		'sha256',
		Buffer.from(hmacKey, 'base64') as any,
	);
	hmac.update(Buffer.from(iv, 'base64') as any);
	hmac.update(cipherText as any);
	const calculatedHmac = hmac.digest();

	if (!calculatedHmac.slice(0, 10).equals(hmac10 as any)) {
		throw new Error('HMAC mismatch for cdn_file.');
	}

	const decipher = crypto.createDecipheriv(
		'aes-256-cbc',
		Buffer.from(encryptionKey, 'base64') as any,
		Buffer.from(iv, 'base64') as any,
	);
	const decryptedMedia = Buffer.concat([
		decipher.update(cipherText as any) as any,
		decipher.final(),
	]);

	const decryptedMediaHash = crypto
		.createHash('sha256')
		.update(decryptedMedia as any)
		.digest('base64');
	if (decryptedMediaHash !== plaintextHash) {
		throw new Error('Plaintext hash mismatch for decrypted media.');
	}

	return decryptedMedia;
}
