enum EMessageEvent {
	ON_FILE_RECEIVED = 'ON_FILE_RECEIVED',
	ON_CHATGPT_MESSAGE = 'ON_CHATGPT_MESSAGE',
	ON_DIALOGFLOW_MESSAGE = 'ON_DIALOGFLOW_MESSAGE',
	ON_DID_NOT_UNDERSTAND = 'ON_DID_NOT_UNDERSTAND',
	ON_SESSION_TIMEOUT = 'ON_SESSION_TIMEOUT',
	ON_CLOSING_OF_LIVE_CHAT = 'ON_CLOSING_OF_LIVE_CHAT',
}

const MessageEventMapping: Record<EMessageEvent, string> = {
	[EMessageEvent.ON_FILE_RECEIVED]: 'onFileReceived',
	[EMessageEvent.ON_CHATGPT_MESSAGE]: 'onChatGPTMessage',
	[EMessageEvent.ON_DIALOGFLOW_MESSAGE]: 'onDialogflowMessage',
	[EMessageEvent.ON_DID_NOT_UNDERSTAND]: 'onDidNotUnderstand',
	[EMessageEvent.ON_SESSION_TIMEOUT]: 'onSessionTimeout',
	[EMessageEvent.ON_CLOSING_OF_LIVE_CHAT]: 'onClosingOfLiveChat',
};

export { EMessageEvent, MessageEventMapping };
