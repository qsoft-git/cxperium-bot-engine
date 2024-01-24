import { TAutomateConfig } from './automate';
import { TChatGPTConfig } from './chatgpt';
import { TDialogflowConfig } from './dialogflow';
import { TGdprConfig } from './gdpr';
import { TCxperiumLiveConfig } from './live';
import { TWhatsappConfig } from './whatsapp';
import { TBotFrameworkConfig } from './botframework';
import { TEnterpriseChatGPTConfig } from './enterpriseChatGPT';

export type TCxperiumEnvironment = {
	whatsappConfig: TWhatsappConfig;
	cxperiumLiveConfig: TCxperiumLiveConfig;
	dialogflowConfig: TDialogflowConfig;
	chatgptConfig: TChatGPTConfig;
	gdprConfig: TGdprConfig;
	automateConfig: TAutomateConfig;
	botframeworkConfig: TBotFrameworkConfig;
	enterpriseChatgptConfig: TEnterpriseChatGPTConfig;
	extraFields: Record<string, unknown>;
};
