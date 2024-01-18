export type TConversation = {
	conversationData: Record<string, unknown>[];
	waitData: {
		className: string;
		functionName: string;
	};
	faultCount: number;
	languageId: 1;
	sessionData: Record<string, unknown>[];
	lastMessage: string;
	cultureCode: 'TR';
};
