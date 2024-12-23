interface IMessageEvent {
	onFileReceived?(): void;
	onChatGPTMessage?(messageObject: unknown): void;
	onDialogflowMessage?(messageObject: unknown): void;
	onDidNotUnderstand?(messageObject: unknown): void;
	onSessionTimeout?(): void;
	onClosingOfLiveChat?(): void;
}

export { IMessageEvent };
