// Node modules.
import fetch from 'node-fetch';

// Services.
import ServiceCxperium from '.';
import ServiceCxperiumContact from './contact';
import ServiceCxperiumConversation from './conversation';

// Intefaces.
import { ICxperiumParams } from '../../interfaces/services/cxperium';

// Types.
import { TCxperiumLanguage } from '../../types/cxperium/language';

// Utils.
import UtilConfig from '../../utils/config';

export default class extends ServiceCxperium {
	serviceCxperiumContact!: ServiceCxperiumContact;
	serviceCxperiumConversation!: ServiceCxperiumConversation;
	private cache = UtilConfig.getInstance().cache;
	constructor(data: ICxperiumParams) {
		super(data);
		this.serviceCxperiumContact = new ServiceCxperiumContact(data);
		this.serviceCxperiumConversation = new ServiceCxperiumConversation(
			data,
		);
	}

	async getAllLanguage(): Promise<TCxperiumLanguage[]> {
		const cached: TCxperiumLanguage[] | undefined =
			this.cache.get('GET_ALL_LANGUAGE');

		if (cached) return cached;

		const response = (await fetch(
			`${this.baseUrl}/api/assistant/localization`,
			{
				method: 'GET',
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			},
		).then((response) => response.json())) as any;

		let languages!: TCxperiumLanguage[];
		for (const [, value] of Object.entries(response.data.data) as any) {
			const language: TCxperiumLanguage = {
				id: value.languageId,
				cultureCode: value.cultureCode,
				name: value.name,
				isDefault: Boolean(value.isDefault),
				data: value.data,
			};

			languages.push(language);
		}

		this.cache.set('ALL_LANGUAGES', languages);

		return languages;
	}

	async ClearCache() {
		this.cache.flushAll();
	}

	async getLanguageById(languageId: number) {
		const languages = await this.getAllLanguage();

		for (const language of languages) {
			if (language.id == languageId) return language;
		}
	}

	async getLanguageByKey(languageId: number, key: string) {
		const languages = await this.getAllLanguage();

		for (const language of languages) {
			if (language.id == languageId) {
				for (const [k, v] of Object.entries(language.data) as any) {
					if (k === key) {
						return v;
					}
				}
			}
		}

		return null;
	}

	async getDefaultLanguage() {
		let defaultLanguages!: TCxperiumLanguage[];
		const languages = await this.getAllLanguage();

		for (const language of languages) {
			if (Boolean(language.isDefault)) defaultLanguages.push(language);
		}
	}
}
