import { TConversation } from '../types/conversation';

export default class BaseConversation {
	private session: Record<string, unknown>[];
	waitData: {
		className?: string;
	};
	faultCount: number;
	languageId: number;

	constructor(conversation: TConversation) {
		this.waitData = conversation.waitData;
		this.session = conversation.conversationData;
		this.faultCount = conversation.faultCount;
		this.languageId = conversation.languageId;
	}

	isWaitAny() {
		return Object.values(this.waitData).length > 0;
	}

	addWaitAction(className: string) {
		this.waitData.className = className;
	}

	removeWaitAction() {
		this.waitData.className = '';
	}

	putData(data: Record<string, unknown>) {
		if (!this.session.includes(data)) this.session.push(data);
		else {
			const index = this.session.indexOf(data);
			this.session.splice(index, 1);
		}
	}

	getData(key: string): Record<string, unknown> {
		const returnVal: Record<string, unknown> = {
			key: '',
			value: '',
		};

		for (const rec of this.session) {
			if (key === rec.key) {
				returnVal.key = rec.key;
				returnVal.value = rec.value;
			}
		}

		return returnVal;
	}

	resetConversation() {
		this.session = [];
		this.waitData = {};
	}

	increaseFaultCount() {
		const faultCount: Record<string, unknown> = {
			key: 'faultCount',
			value: this.faultCount + 1,
		};

		this.session.push(faultCount);
	}

	resetFaultCount() {
		this.putData({ key: 'faultCount', value: 0 });
	}
}
