// ? Types.
import { Dialog } from '../types/dialog';
import { FlowRequest } from '../types/whatsapp/flow-request';
import { FlowResponse } from '../types/whatsapp/flow-response';

export interface IFlow {
	receiveFlow?(request?: FlowRequest): Promise<void>;
	returnResponse?(request: FlowRequest): Promise<FlowResponse>;
	refreshOnBack?(request: FlowRequest): Promise<FlowResponse>;
}

export interface ExecuteFlow {
	execute(
		dialog: Dialog,
		request: FlowRequest | undefined,
		intentName: string,
	): Promise<FlowResponse>;
}
