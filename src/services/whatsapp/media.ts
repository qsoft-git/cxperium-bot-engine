// Services.
import ServiceCxperiumConfiguration from '../../services/cxperium/configuration';
import ServiceWhatsApp from './index';

export default class extends ServiceWhatsApp {
	constructor(params: ServiceCxperiumConfiguration) {
		super(params);
	}

	private async uploadMedia(
		media: Buffer,
		contentType: string,
	): Promise<any> {
		return await this.uploadFileRequest(media, contentType, 'v1/media');
	}

	public async getMediaWithId(id: string, mimeType: string) {
		const fileContent = await this.getFileRequest(id, mimeType);
		return fileContent;
	}

	public async uploadMediaWithUrl(
		url: string,
		mimetype: string,
	): Promise<any> {
		const response = await fetch(url);
		const buffer = Buffer.from(await response.arrayBuffer());
		const mediaId = await this.uploadMedia(buffer, mimetype);
		return mediaId;
	}

	public async sendDocumentWithUrl(
		to: string,
		filename: string,
		url: string,
	): Promise<any> {
		const body = {
			recipient_type: 'individual',
			to: to,
			type: 'document',
			document: {
				link: url,
				filename: filename,
			},
		};

		return await this.wpRequest(body, 'v1/messages');
	}

	public async sendImageWithUrl(
		to: string,
		filename: string,
		url: string,
	): Promise<any> {
		const body = {
			recipient_type: 'individual',
			to: to,
			type: 'image',
			image: {
				link: url,
				filename: filename,
			},
		};

		return await this.wpRequest(body, 'v1/messages');
	}

	public async sendStickerWithUrl(to: string, url: string): Promise<any> {
		const body = {
			recipient_type: 'individual',
			to: to,
			type: 'sticker',
			sticker: {
				link: url,
			},
		};

		const res = await this.wpRequest(body, 'v1/messages');

		return res;
	}
}
