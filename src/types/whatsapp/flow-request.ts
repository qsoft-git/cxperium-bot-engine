export type FlowRequest = {
	action: string;
	version: string;
	flow_token: string;
	screen: string;
	data: Record<string, any>;
	decryptedAesKey?: Uint8Array;
	initialVector?: Uint8Array;
};
