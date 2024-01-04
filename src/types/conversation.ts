export type TConversation = {
	conversationData: Record<string, unknown>[];
	waitData: {
		className?: string;
	};
	faultCount: number;
	languageId: number;
	sessionData: Record<string, unknown>[];
	lastMessage: string;
	cultureCode: string;
};
