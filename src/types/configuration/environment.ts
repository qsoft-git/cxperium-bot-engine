import { TAutomateConfig } from './automate';
import { TChatGPTConfig } from './chatgpt';
import { TDialogflowConfig } from './dialogflow';
import { TGdprConfig } from './gdpr';
import { TCxperiumLiveConfig } from './live';
import { TWhatsappConfig } from './whatsapp';

export type TCxperiumEnvironment = {
	whatsappConfig: TWhatsappConfig;
	cxperiumLiveConfig: TCxperiumLiveConfig;
	dialogflowConfig: TDialogflowConfig;
	chatgptConfig: TChatGPTConfig;
	gdprConfig: TGdprConfig;
	automateConfig: TAutomateConfig;
	extraFields: Record<string, unknown>;
};
