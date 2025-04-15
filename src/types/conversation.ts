export type TConversation = {
	conversationData: Record<string, unknown>[];
	waitData: {
		className: string;
		functionName: string;
	};
	languageId: 1 | number;
	sessionData: Record<string, unknown>[];
	lastMessage: string;
	contextId: string,
	messageType: string;
	cultureCode: 'TR' | string;
	cache: Record<string, unknown>;
};
