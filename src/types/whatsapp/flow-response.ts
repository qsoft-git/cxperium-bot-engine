export type FlowResponse = {
    version: string;
    action : string;
    screen : string;
    data: Record<string, any>;
}