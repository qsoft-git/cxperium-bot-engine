import fetch from 'node-fetch';

// Services.
import ServiceCxperium from '.';

// Interfaces.
import { ICxperiumParams } from '../../interfaces/services/cxperium';
import ServiceCxperiumContact from './contact';
import ServiceCxperiumConversation from './conversation';
import { Language } from '../../types/cxperium/language';
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
		const cached: Language[] | undefined =
			this.cache.get('GET_ALL_LANGUAGE');

		// if (cached) return cached;

		// const languages: Language[];
		const response = (await fetch(
			this.baseUrl + 'api/assistant/localization',
			{
				method: 'GET',
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			},
		).then((response) => response.json())) as any;

		const res = response;

		// for (const lang in response.data.data) {
		// 	const language: Language = {
		// 		id: lang.languageId,
		// 		cultureCode: lang['cultureCode'],
		// 		name: lang['name'],
		// 	};

		// 	language.data[lang.key] = lang.value;
		// }

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
