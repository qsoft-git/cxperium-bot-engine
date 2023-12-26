export interface IIndexExport {
	mode: string;
	host: string;
	port: string;
	apiKey: string;
	dialogPath: string;
	listen(): void;
	initDialog(): void;
}
