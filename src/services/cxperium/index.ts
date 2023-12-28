// Interfaces.
import { ICxperiumParams } from '../../interfaces/services/cxperium';

export default class {
	private BASE_URL: string;
	private API_KEY: string;
	private CALLBACK_URL: string;

	constructor({
		apikey: _apikey,
		baseUrl: _baseUrl,
		callbackUrl: _callbackUrl,
	}: ICxperiumParams) {
		this.API_KEY = _apikey;
		this.CALLBACK_URL = _callbackUrl;
		this.BASE_URL = _baseUrl;
	}

	public get baseUrl(): string {
		return this.BASE_URL;
	}

	public get apiKey(): string {
		return this.API_KEY;
	}

	public get callbackUrl(): string {
		return this.CALLBACK_URL;
	}
}
