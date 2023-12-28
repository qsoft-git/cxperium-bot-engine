// Interfaces.
import { IUtilsCxperium } from '../interfaces/utils/cxperium';
import { SrcIndexConfig } from '../interfaces/src-index';

// Export default module.
export class UtilCxperium implements IUtilsCxperium {
	apiKey!: string;
	callbackUrl!: string;

	public initCxperiumProperties({
		apiKey: _apiKey,
		callbackUrl: _callbackUrl,
	}: SrcIndexConfig): void {
		this.apiKey = _apiKey;
		this.callbackUrl = _callbackUrl;

		if (!this.apiKey) {
			throw new Error('API_KEY is not set.');
		}
	}
}
