// Services.
import ServiceCxperiumConfiguration from '../../services/cxperium/configuration';
import ServiceWhatsApp from './index';

export default class extends ServiceWhatsApp {
	constructor(params: ServiceCxperiumConfiguration) {
		super(params);
	}

	public async uploadMedia(media: Buffer, contentType: string): Promise<any> {
		return await this.uploadFileRequest(media, contentType, 'v1/media');
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

	public async sendDocumentWithUrl(to: string, url: string): Promise<any> {
		const body = {
			recipient_type: 'individual',
			to: to,
			type: 'document',
			document: {
				link: url,
			},
		};

		return await this.wpRequest(body, 'v1/messages');
	}

	public async sendImageWithUrl(to: string, url: string): Promise<any> {
		const body = {
			recipient_type: 'individual',
			to: to,
			type: 'image',
			image: {
				link: url,
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
