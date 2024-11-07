import { TChatGPTConfig } from './chatgpt';
import { TDialogflowConfig } from './dialogflow';
import { TGdprConfig } from './gdpr';
import { TCxperiumLiveConfig } from './live';
import { TWhatsappConfig } from './whatsapp';
import { TEnterpriseChatGPTConfig } from './enterpriseChatGPT';
import { TSessionTimeoutConfig } from './sessionTimeout';

export type TCxperiumEnvironment = {
	whatsappConfig: TWhatsappConfig;
	cxperiumLiveConfig: TCxperiumLiveConfig;
	dialogflowConfig: TDialogflowConfig;
	chatgptConfig: TChatGPTConfig;
	gdprConfig: TGdprConfig;
	enterpriseChatgptConfig: TEnterpriseChatGPTConfig;
	sessionTimeoutConfig: TSessionTimeoutConfig;
	extraFields: Record<string, unknown>;
};
