export type TConversation = {
	conversationData: Record<string, unknown>[];
	waitData: {
		className?: string;
	};
	faultCount: number;
	languageId: number;
};
