// ? Types.
import { EMessageEvent } from '../message-event';

export type TFlowMessage = {
	recipient_type: 'individual';
	to: string;
	type: 'interactive';
	interactive: {
		type: 'flow';
		header: {
			type?: string;
			text: string | null;
		};
		body: {
			text: string;
		};
		footer: {
			text: string | null;
		};
		action: {
			name: 'flow';
			parameters: {
				flow_message_version: '3';
				flow_token: string;
				flow_id: string;
				flow_cta: string;
				flow_action: string;
				flow_action_payload: {
					screen: string;
					data?: object | null | undefined;
				};
			};
		};
	};
};

export enum ExecutionInterface {
	REFRESH_ON_BACK = 'refreshOnBack',
	RECEIVE_FLOW = 'receiveFlow',
	RETURN_RESPONSE = 'returnResponse',
	RUN_DIALOG = 'runDialog',
	ON_FILE_RECEIVED = 'ON_FILE_RECEIVED',
	ON_CHATGPT_MESSAGE = 'ON_CHATGPT_MESSAGE',
	ON_DIALOGFLOW_MESSAGE = 'ON_DIALOGFLOW_MESSAGE',
	ON_DID_NOT_UNDERSTAND = 'ON_DID_NOT_UNDERSTAND',
	ON_SESSION_TIMEOUT = 'ON_SESSION_TIMEOUT',
	ON_CLOSING_OF_LIVE_CHAT = 'ON_CLOSING_OF_LIVE_CHAT',
	EVENT_HANDLER = 'EVENT_HANDLER',
}

export const executionParamsMapping: Record<ExecutionInterface, string> = {
	[ExecutionInterface.REFRESH_ON_BACK]: 'refreshOnBack',
	[ExecutionInterface.RECEIVE_FLOW]: 'receiveFlow',
	[ExecutionInterface.RETURN_RESPONSE]: 'returnResponse',
	[ExecutionInterface.RUN_DIALOG]: 'runDialog',
	[EMessageEvent.ON_FILE_RECEIVED]: 'onFileReceived',
	[EMessageEvent.ON_CHATGPT_MESSAGE]: 'onChatGPTMessage',
	[EMessageEvent.ON_DIALOGFLOW_MESSAGE]: 'onDialogflowMessage',
	[EMessageEvent.ON_DID_NOT_UNDERSTAND]: 'onDidNotUnderstand',
	[EMessageEvent.ON_SESSION_TIMEOUT]: 'onSessionTimeout',
	[EMessageEvent.ON_CLOSING_OF_LIVE_CHAT]: 'onClosingOfLiveChat',
	[ExecutionInterface.EVENT_HANDLER]: 'EVENT_HANDLER',
};
