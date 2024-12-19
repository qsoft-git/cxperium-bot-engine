import { FlowRequest } from '../types/whatsapp/flow-request';
import { FlowResponse } from '../types/whatsapp/flow-response';

export interface IFlow {
	receiveFlow(request?: FlowRequest): void;
	returnResponse(request: FlowRequest): FlowResponse;
	refreshOnBack(request: FlowRequest): FlowResponse;
}

export interface ExecuteFlow {
	execute(
		dialog: any,
		request: FlowRequest | undefined,
		intentName: string,
	): Promise<FlowResponse>;
}
