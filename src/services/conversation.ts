// Types.
import { TConversation } from '../types/conversation';

export default class BaseConversation {
	conversation: TConversation;
	cache: any;
	contact: any;
	public dialogFileParams: any;

	constructor(dialog: any, conversation: TConversation) {
		this.conversation = conversation;
		this.cache = dialog.services.cxperium.session.cache;
		this.contact = dialog.contact;
	}

	isWaitAction(functionName: string) {
		return this.conversation.waitData.functionName === functionName;
	}

	isWaitAny() {
		return (
			String(this.conversation.waitData?.className).length != 0 &&
			String(this.conversation.waitData?.functionName).length != 0
		);
	}

	addWaitAction(functionName: string) {
		this.conversation.waitData.className = this.dialogFileParams.name;
		this.conversation.waitData.functionName = functionName;
		this.cache.set(`CONVERSATION-${this.contact.phone}`, this.conversation);
	}

	removeWaitAction() {
		this.conversation.waitData = {
			className: '',
			functionName: '',
		};
		this.cache.set(`CONVERSATION-${this.contact.phone}`, this.conversation);
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

	getCache(key: string) {
		if (!key || typeof key != 'string' || String(key).length == 0) {
			return null;
		} else {
			return this.conversation.cache?.[key];
		}
	}

	setCache(key: string, value: string) {
		if (!key || typeof key != 'string' || String(key).length == 0) return;

		this.conversation.cache[key || 'NULL'] = value || '';
		this.cache.set(`CONVERSATION-${this.contact.phone}`, this.conversation);
	}

	clearCache() {
		this.conversation.cache = {};
		this.cache.set(`CONVERSATION-${this.contact.phone}`, this.conversation);
	}

	getLastMessage() {
		return this.conversation.lastMessage;
	}
}
