// Services.
import ServiceWhatsApp from './';

export default class extends ServiceWhatsApp {
	public async uploadMedia(media: Buffer, contentType: string) {
		await this.uploadFileRequest(media, contentType, 'v1/media');
	}

	public async uploadMediaWithUrl(url: string, mimetype: string) {
		const response = await fetch('https://www.orimi.com/pdf-test.pdf');
		const buffer = Buffer.from(await response.arrayBuffer());
		const mediaId = await this.uploadMedia(buffer, mimetype);

		return mediaId;
	}

	public async sendDocumentWithUrl(
		to: string,
		url: string,
		mimetype: string,
	) {
		const id = await this.uploadMediaWithUrl(url, mimetype);

		const body = {
			recipient_type: 'individual',
			to: to,
			type: 'document',
			document: {
				id: id,
			},
		};

		await this.wpRequest(body, 'application/json', 'v1/messages');
	}

	public async sendImageWithUrl(to: string, url: string, mimetype: string) {
		const id = await this.uploadMediaWithUrl(url, mimetype);

		const body = {
			recipient_type: 'individual',
			to: to,
			type: 'image',
			image: {
				id: id,
			},
		};

		await this.wpRequest(body, 'application/json', 'v1/messages');
	}

	public async sendSticker(id: string, to: string) {
		const body = {
			recipient_type: 'individual',
			to: to,
			type: 'sticker',
			sticker: {
				id: id,
			},
		};

		await this.wpRequest(body, 'application/json', 'v1/messages');
	}
}
