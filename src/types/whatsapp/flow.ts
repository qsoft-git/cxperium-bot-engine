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

export enum ExecutionParameters {
	REFRESH_ON_BACK = 'refreshOnBack',
	RECEIVE_FLOW = 'receiveFlow',
	RETURN_RESPONSE = 'returnResponse',
	RUN_DIALOG = 'runDialog',
	ON_FILE_RECEIVED = 'onFileReceived',
	ON_CHATGPT_MESSAGE = 'onChatGPTMessage',
	ON_DIALOGFLOW_MESSAGE = 'onDialogflowMessage',
	ON_DID_NOT_UNDERSTAND = 'onDidNotUnderstand',
}

export const executionParamsMapping: Record<ExecutionParameters, string> = {
	[ExecutionParameters.REFRESH_ON_BACK]: 'refreshOnBack',
	[ExecutionParameters.RECEIVE_FLOW]: 'receiveFlow',
	[ExecutionParameters.RETURN_RESPONSE]: 'returnResponse',
	[ExecutionParameters.RUN_DIALOG]: 'runDialog',
	[ExecutionParameters.ON_FILE_RECEIVED]: 'onFileReceived',
	[ExecutionParameters.ON_CHATGPT_MESSAGE]: 'onChatGPTMessage',
	[ExecutionParameters.ON_DIALOGFLOW_MESSAGE]: 'onDialogflowMessage',
	[ExecutionParameters.ON_DID_NOT_UNDERSTAND]: 'onDidNotUnderstand',
};
