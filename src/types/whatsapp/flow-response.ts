import { BaseFlowResponse } from "./base-flow-response";

export type FlowResponse = BaseFlowResponse &  {
    screen : string;
    data: Record<string, any>;
}