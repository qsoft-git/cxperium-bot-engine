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

	public isWaitAction(functionName: string): boolean {
		return this.conversation.waitData.functionName === functionName;
	}

	public isWaitAny(): any {
		return (
			String(this.conversation.waitData?.className).length != 0 &&
			String(this.conversation.waitData?.functionName).length != 0
		);
	}

	public addWaitAction(functionName: string): void {
		this.conversation.waitData.className = this.dialogFileParams.name;
		this.conversation.waitData.functionName = functionName;
		this.cache.set(`CONVERSATION-${this.contact.phone}`, this.conversation);
	}

	public removeWaitAction(): void {
		this.conversation.waitData = {
			className: '',
			functionName: '',
		};
		this.cache.set(`CONVERSATION-${this.contact.phone}`, this.conversation);
	}

	public resetConversation(): void {
		this.conversation.sessionData = [];
		this.conversation.waitData = {
			className: '',
			functionName: '',
		};
		this.cache.set(`CONVERSATION-${this.contact.phone}`, this.conversation);
	}

	public increaseFaultCount(): void {
		const faultCount = this.getFaultCount();
		this.setCache('faultCount', faultCount + 1);
	}

	public setFaultCount(count: number): void {
		this.setCache('faultCount', count);
	}

	public getFaultCount(): number {
		const faultCount = this.getCache('faultCount');

		if (faultCount) return faultCount;
		else return 1;
	}

	public getCache(key: string): any {
		if (!key || typeof key != 'string' || String(key).length == 0) {
			return null;
		} else {
			return this.conversation.cache?.[key];
		}
	}

	public setCache(key: string, value: any): void {
		if (!key || typeof key != 'string' || String(key).length == 0) return;

		this.conversation.cache[key || 'NULL'] = value || '';
		this.cache.set(`CONVERSATION-${this.contact.phone}`, this.conversation);
	}

	public delCache(key: string): void {
		if (!key || typeof key != 'string' || String(key).length == 0) return;

		delete this.conversation.cache[key];
		this.cache.set(`CONVERSATION-${this.contact.phone}`, this.conversation);
	}

	public clearCache(): void {
		this.conversation.cache = {};
		this.cache.set(`CONVERSATION-${this.contact.phone}`, this.conversation);
	}

	public getLastMessage(): any {
		let index = -2;
		while (true) {
			const last = this.conversation.sessionData.at(
				index,
			) as any['message'];

			if (last.message.length) {
				this.conversation.lastMessage = last.message;
				break;
			}

			index++;
		}

		return this.conversation.lastMessage;
	}
}
