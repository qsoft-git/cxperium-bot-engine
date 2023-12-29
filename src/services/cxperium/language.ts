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

	async getAllLanguage(): Promise<void> {
		const cached: TCxperiumLanguage[] | undefined =
			this.cache.get('GET_ALL_LANGUAGE');

		// if (cached) return cached;

		// const languages: Language[];
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

		const res = response;

		for (const [key, value] of Object.entries(response.data.data) as any) {
			console.log();

			const language: TCxperiumLanguage = {
				id: value.languageId,
				cultureCode: value.cultureCode,
				name: value.name,
				isDefault: Boolean(value.isDefault),
				data: value.data,
			};
		}

		// this.cache.set('ALL_LANGUAGES', languages);

		// return languages;
	}

	// public static void ClearCache()
	// {
	//     CacheManager.Clear(CacheKeys.GET_ALL_LANGUAGE);
	// }

	// public static Language GetLanguageById(int languageId)
	// {
	//     return GetAllLanguage().FirstOrDefault(x => x.Id == languageId);
	// }

	// public static string GetLanguageByKey(int languageId, string key)
	// {
	//     var languages = GetAllLanguage().Where(x => x.Id == languageId).ToList();

	//     foreach (var language in languages)
	//     {
	//         if (language.Data.ContainsKey(key))
	//         {
	//             return language.Data[key];
	//         }
	//     }

	//     return null;
	// }

	// public static Language GetDefaultLanguge()
	// {
	//     return GetAllLanguage().Find(x => x.IsDefault == true);
	// }
}
