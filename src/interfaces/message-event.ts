interface IMessageEvent {
	onFileReceived(): void;
	onChatGPTMessage(): void;
	onDialogflowMessage(): void;
}

export default IMessageEvent;
