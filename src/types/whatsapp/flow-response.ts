export type FLowResponse = { 
action: string; 
  data: Record<string, unknown>;
  amount: string; 
  tenure: string | null; 
  flow_token: string; 
  screen: string; 
  version: string; 
}