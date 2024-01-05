// Types.
import { TConversation } from '../types/conversation';

export default class BaseConversation {
	conversation: TConversation = {
		waitData: {
			className: '',
		},
		conversationData: [],
		sessionData: [],
		languageId: 1,
		lastMessage: '',
		faultCount: 0,
		cultureCode: 'TR',
	};

	constructor(conversation: TConversation) {
		this.conversation = conversation;
	}

	isWaitAny() {
		return Object.values(this.conversation.waitData).length > 0;
	}

	addWaitAction(className: string) {
		this.conversation.waitData.className = className;
	}

	removeWaitAction() {
		this.conversation.waitData.className = '';
	}

	putData(data: Record<string, unknown>) {
		if (!this.conversation.sessionData.includes(data))
			this.conversation.sessionData.push(data);
		else {
			const index = this.conversation.sessionData.indexOf(data);
			this.conversation.sessionData.splice(index, 1);
		}
	}

	getData(key: string): Record<string, unknown> {
		const returnVal: Record<string, unknown> = {
			key: '',
			value: '',
		};

		for (const rec of this.conversation.sessionData) {
			if (key === rec.key) {
				returnVal.key = rec.key;
				returnVal.value = rec.value;
			}
		}

		return returnVal;
	}

	resetConversation() {
		this.conversation.sessionData = [];
		this.conversation.waitData = {};
	}

	increaseFaultCount() {
		const faultCount: Record<string, unknown> = {
			key: 'faultCount',
			value: this.conversation.faultCount + 1,
		};

		this.conversation.sessionData.push(faultCount);
	}

	resetFaultCount() {
		this.putData({ key: 'faultCount', value: 0 });
	}
}
