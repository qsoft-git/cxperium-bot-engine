export interface IFlow {
	recieveFlow(): void;
	returnResponse(body: any): any;
}
