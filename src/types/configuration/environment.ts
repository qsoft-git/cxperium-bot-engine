import { TChatGPTConfig } from './chatgpt';
import { TDialogflowConfig } from './dialogflow';
import { TGdprConfig } from './gdpr';
import { TCxperiumLiveConfig } from './live';
import { TWhatsappConfig } from './whatsapp';
import { TBotFrameworkConfig } from './botframework';
import { TEnterpriseChatGPTConfig } from './enterpriseChatGPT';
import { TSessionTimeoutConfig } from './sessionTimeout';

export type TCxperiumEnvironment = {
	whatsappConfig: TWhatsappConfig;
	cxperiumLiveConfig: TCxperiumLiveConfig;
	dialogflowConfig: TDialogflowConfig;
	chatgptConfig: TChatGPTConfig;
	gdprConfig: TGdprConfig;
	botframeworkConfig: TBotFrameworkConfig;
	enterpriseChatgptConfig: TEnterpriseChatGPTConfig;
	sessionTimeoutConfig: TSessionTimeoutConfig;
	extraFields: Record<string, unknown>;
};
