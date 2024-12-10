import { FlowRequest } from '../types/whatsapp/flow-request';
import { FlowResponse } from '../types/whatsapp/flow-response';

export interface IFlow {
	recieveFlow(): void;
	returnResponse(request: FlowRequest): FlowResponse;
}
