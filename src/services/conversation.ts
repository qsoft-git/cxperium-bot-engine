// Types.
import { TConversation } from '../types/conversation';

export default class BaseConversation {
	conversation: TConversation;

	constructor(conversation: TConversation) {
		this.conversation = conversation;
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

	getData(key: string): unknown {
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

		return returnVal[key];
	}

	resetConversation() {
		this.conversation.sessionData = [];
		this.conversation.waitData = {
			className: '',
			functionName: '',
		};
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
