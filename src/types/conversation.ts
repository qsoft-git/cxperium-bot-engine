export type TConversation = {
	conversationData: Record<string, unknown>[];
	waitData: {
		className: string;
		functionName: string;
	};
	languageId: 1;
	sessionData: Record<string, unknown>[];
	lastMessage: string;
	cultureCode: 'TR';
	cache: Record<string, unknown>;
};
