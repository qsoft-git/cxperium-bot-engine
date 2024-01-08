// Types.
import { TConversation } from '../types/conversation';

export default class BaseConversation {
	conversation: TConversation;
	cache: any;
	contact: any;

	constructor(dialog: any, conversation: TConversation) {
		this.conversation = conversation;
		this.cache = dialog.services.cxperium.session.cache;
		this.contact = dialog.contact;
	}

	isWaitAction(functionName: string) {
		if (this.conversation.waitData.functionName === functionName)
			return true;
		return false;
	}

	isWaitAny() {
		return Object.values(this.conversation.waitData).length > 2;
	}

	addWaitAction(className: string, functionName: string) {
		this.conversation.waitData.className = className;
		this.conversation.waitData.functionName = functionName;

		this.cache.set(`CONVERSATION-${this.contact.phone}`, this.conversation);
	}

	removeWaitAction() {
		this.cache.del(`CONVERSATION-${this.contact.phone}`);
	}

	resetConversation() {
		this.conversation.sessionData = [];
		this.conversation.waitData = {
			className: '',
			functionName: '',
		};

		this.cache.set(`CONVERSATION-${this.contact.phone}`, this.conversation);
	}

	increaseFaultCount() {
		const faultCount: Record<string, unknown> = {
			key: 'faultCount',
			value: this.conversation.faultCount + 1,
		};

		this.conversation.sessionData.push(faultCount);

		this.cache.set(`CONVERSATION-${this.contact.phone}`, this.conversation);
	}
}
