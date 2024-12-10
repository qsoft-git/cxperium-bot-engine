import { FLowResponse } from "../types/whatsapp/flow-response";

export interface IFlow {
	recieveFlow(): void;
	returnResponse(body: FLowResponse): FLowResponse;
}
