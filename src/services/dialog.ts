// ? Environment.
const { NODE_ENV, RESET_KEY } = process.env;

// ? Node modules.
import * as fs from 'fs';
import * as path from 'path';
import NodeCache from 'node-cache';

// ? Cache.
import data from '../data/general';

// ? Types.
import { TBaseDialogCtor, TAppLocalsServices } from '../types/base-dialog';
import { TIntentPrediction } from '../types/intent-prediction';
import { FlowRequest } from '../types/whatsapp/flow-request';
import { FlowResponse } from '../types/whatsapp/flow-response';
import { TCxperiumLiveConfig } from '../types/configuration/live';
import { TButton } from '../types/whatsapp/message';
import { TChatGPTResponse } from '../types/chatgpt/response';
import { EMessageEvent } from '../types/message-event';

// ? Services.
import ServiceDialogflow from './dialogflow/match';
import ServiceChatGPT from './chatgpt/match';
import { activityToText } from './init-activity';
import BaseConversation from './conversation';
import { ExecuteFlow } from '../interfaces/flow';
import {
	ExecutionParameters,
	executionParamsMapping,
} from '../types/whatsapp/flow';

const CHANNELS: Record<string, any> = {
	WHATSAPP: '1',
};

const ENTRY_INTENT_NAME = 'CXPerium.Dialogs.WhatsApp.Entry';

export default class {
	private folderPathExternal!: string;
	private folderPathInternal!: string;
	private listAll: { name: string; path: string }[] = [];
	public cache: NodeCache;

	constructor(_dialogPath: string) {
		this.folderPathExternal = _dialogPath;
		this.folderPathInternal = path.join(__dirname, '../dialogs');
		this.initList(this.folderPathExternal, 'EXTERNAL');
		this.initList(this.folderPathInternal, 'INTERNAL');
		this.cache = data.cache;
	}

	public get getListAll() {
		return this.listAll;
	}

	public async runWithConversationWaitAction(dialog: any): Promise<boolean> {
		const conversation: BaseConversation = dialog.conversation;

		if (!conversation.isWaitAny()) return false;

		const runParams = await this.prepareRunParams(
			dialog,
			conversation.conversation.waitData.className,
			ExecutionParameters.RUN_DIALOG,
		);

		await this.runDynamicImport(
			runParams,
			undefined,
			ExecutionParameters.RUN_DIALOG,
		);

		return true;
	}

	public async runWithMatch(dialog: any): Promise<void> {
		const prediction: TIntentPrediction =
			await this.intentPrediction(dialog);

		const isFile =
			dialog.activity.image.id ||
			dialog.activity.document.id ||
			dialog.activity.video.id;

		if (isFile) {
			try {
				return await this.runMessageEvent(
					dialog,
					prediction,
					EMessageEvent.ON_FILE_RECEIVED,
				);
			} catch (error: any) {
				if (
					error.message ===
					'FILE_RECEIVED_EVENT_NOT_IMPLEMENTED_ERROR'
				) {
					console.info(
						'You may want to add onFileReceived event on your Entry.ts file!',
					);
				}
			}
		}

		dialog.contact =
			await dialog.services.cxperium.contact.getContactByPhone(dialog);

		if (prediction.isMatch && prediction.fulfillment) {
			try {
				await this.runMessageEvent(
					dialog,
					prediction,
					EMessageEvent.ON_DIALOGFLOW_MESSAGE,
				);
			} catch (error: any) {
				if (
					error.message === 'DIALOGFLOW_EVENT_NOT_IMPLEMENTED_ERROR'
				) {
					await dialog.services.whatsapp.message.sendRegularMessage(
						dialog.contact.phone,
						prediction.fulfillment,
					);
				}
			}

			return;
		}

		if (prediction.isMatch && prediction.chatgptMessage) {
			try {
				await this.runMessageEvent(
					dialog,
					prediction,
					EMessageEvent.ON_CHATGPT_MESSAGE,
				);
			} catch (error: any) {
				if (error.message === 'CHATGPT_EVENT_NOT_IMPLEMENTED_ERROR') {
					await dialog.services.whatsapp.message.sendRegularMessage(
						dialog.contact.phone,
						prediction.chatgptMessage,
					);
				}
			}

			return;
		}

		if (prediction.isMatch && prediction.intent) {
			const runParams = await this.prepareRunParams(
				dialog,
				prediction.intent,
				ExecutionParameters.RUN_DIALOG,
			);

			await this.runDynamicImport(
				runParams,
				undefined,
				ExecutionParameters.RUN_DIALOG,
			);
		} else {
			const liveConfig: TCxperiumLiveConfig = (
				await dialog.services.cxperium.configuration.execute()
			).cxperiumLiveConfig;

			const conversation: BaseConversation = dialog.conversation;
			const faultCount = conversation.getFaultCount();
			if (liveConfig.IsActive) {
				if (faultCount >= liveConfig.TransferFaultCount) {
					conversation.setFaultCount(1);
					const buttons: TButton[] = [
						{
							id: 'humantransfer_yes',
							title: await dialog.services.cxperium.language.getLanguageByKey(
								conversation.conversation.languageId,
								'yes_humantransfer',
							),
						},
						{
							id: 'humantransfer_no',
							title: await dialog.services.cxperium.language.getLanguageByKey(
								conversation.conversation.languageId,
								'no_humantransfer',
							),
						},
					];

					await dialog.services.whatsapp.message.sendButtonMessage(
						dialog.contact.phone,
						await dialog.services.cxperium.language.getLanguageByKey(
							conversation.conversation.languageId,
							'transfer_representative_title',
						),
						'',
						await dialog.services.cxperium.language.getLanguageByKey(
							conversation.conversation.languageId,
							'transfer_message_to_representative',
						),
						buttons,
					);

					return;
				}
			}
			conversation.increaseFaultCount();

			try {
				await this.runMessageEvent(
					dialog,
					prediction,
					EMessageEvent.ON_DID_NOT_UNDERSTAND,
				);
			} catch (error: any) {
				if (
					error.message ===
					'DID_NOT_UNDERSTAND_EVENT_NOT_IMPLEMENTED_ERROR'
				) {
					await this.runWithIntentName(
						dialog,
						'CXPerium.Dialogs.WhatsApp.System.Unknown.IntentNotFoundDialog',
					);
				}
			}
		}
	}

	public async runWithAi(dialog: any, activity: string): Promise<any> {
		const services: TAppLocalsServices = dialog.services;

		let prediction: string | null;
		const env = await services.cxperium.configuration.execute();

		if (env.chatgptConfig.IsEnabled) {
			const chatgptService = new ServiceChatGPT(services);
			const result = await chatgptService.chatGPTMatch(
				activity,
				env.chatgptConfig,
			);

			prediction = result.chatgptMessage;
		} else if (env.enterpriseChatgptConfig.IsEnabled) {
			const chatgptService = new ServiceChatGPT(services);
			const result = await chatgptService.enterpriseChatGPTMatch(
				activity,
				activity,
				env.enterpriseChatgptConfig,
			);

			prediction = result.chatgptMessage;
		} else {
			prediction = null;
		}

		return prediction;
	}

	public async runWithAiFrom(dialog: any, activity: string): Promise<any> {
		const services: TAppLocalsServices = dialog.services;

		let prediction: string | null;
		const env = await services.cxperium.configuration.execute();

		if (env.chatgptConfig.IsEnabled) {
			const chatgptService = new ServiceChatGPT(services);
			const result = await chatgptService.chatGPTMatch(
				activity,
				env.chatgptConfig,
			);

			prediction = result.chatgptMessage;
		} else if (env.enterpriseChatgptConfig.IsEnabled) {
			const chatgptService = new ServiceChatGPT(services);
			const result = await chatgptService.enterpriseChatGPTMatch(
				activity,
				dialog.activity.from,
				env.enterpriseChatgptConfig,
			);

			prediction = result.chatgptMessage;
		} else {
			prediction = null;
		}

		return prediction;
	}

	public async requestChatGPTResponse(
		dialog: any,
		activity: string,
	): Promise<TChatGPTResponse>;
	public async requestChatGPTResponse(
		dialog: any,
		activity: string,
		config?: { assistantId: string; apiKey: string },
	): Promise<TChatGPTResponse>;
	public async requestChatGPTResponse(
		dialog: any,
		activity: string,
		config?: any,
	): Promise<TChatGPTResponse> {
		let env: { assistantId: string; apiKey: string };
		const services: TAppLocalsServices = dialog.services;

		if (config) {
			env = config;
		} else {
			const cx = await services.cxperium.configuration.execute();

			env = {
				assistantId: cx.chatgptConfig.AsistanId,
				apiKey: cx.chatgptConfig.APIKey,
			};
		}

		let from: string;

		if (dialog?.activity?.from?.aadObjectId)
			from = dialog.activity.from.aadObjectId;
		else from = dialog.activity.from;

		const chatgptService = new ServiceChatGPT(services);
		const result = await chatgptService.chatgptAssistantChat(
			activity,
			from,
			env,
		);

		const prediction: TChatGPTResponse = result;

		return prediction;
	}

	private async intentPrediction(dialog: any): Promise<TIntentPrediction> {
		const services: TAppLocalsServices = dialog.services;

		let prediction: TIntentPrediction = {
			isMatch: false,
			intent: null,
			type: null,
			fulfillment: null,
			chatgptMessage: null,
		};

		const env = await services.cxperium.configuration.execute();

		const activity = activityToText(dialog.activity);

		if (RESET_KEY && RESET_KEY == activity) {
			console.log('!!! Server shutdown request sent !!!');
			process.exit(137);
		}

		let cxperiumAllIntents = services.cxperium.intent.cache.get(
			'all-intents',
		) as any;

		if (!cxperiumAllIntents)
			cxperiumAllIntents = await services.cxperium.intent.getAllIntents();

		const channelNumber = CHANNELS[dialog.place] as string;
		const intentParams = cxperiumAllIntents.find(
			(item: any) =>
				channelNumber == item.channel &&
				new RegExp(item.regexValue, 'i').test(activity),
		);

		if (intentParams) {
			prediction.intent = intentParams.name;
			prediction.isMatch = true;
			prediction.type = 'REGEX';

			await dialog.services.cxperium.report.sendAssistantReport(
				dialog.activity.from,
				prediction.intent ? prediction.intent : 'NOT FOUND',
				dialog.activity.text.length > 1
					? dialog.activity.text
					: dialog.activity.value.id,
				prediction.type ? prediction.type : 'NOT FOUND',
			);

			return prediction;
		}

		if (
			!prediction.isMatch &&
			env.dialogflowConfig.IsEnable &&
			activity.length > 1
		) {
			const df = new ServiceDialogflow(services);
			prediction = await df.dialogflowMatch(
				activity,
				dialog.contact._id,
				dialog.conversation.conversation.cultureCode,
			);
		}

		if (
			!prediction.isMatch &&
			env.chatgptConfig.IsEnabled &&
			activity.length > 1
		) {
			const chatgptService = new ServiceChatGPT(services);
			prediction = await chatgptService.chatGPTMatch(
				activity,
				env.chatgptConfig,
			);
		}

		if (
			!prediction.isMatch &&
			env.enterpriseChatgptConfig.IsEnabled &&
			activity.length > 1
		) {
			const chatgptService = new ServiceChatGPT(services);
			prediction = await chatgptService.enterpriseChatGPTMatch(
				activity,
				dialog.activity.from,
				env.enterpriseChatgptConfig,
			);
		}

		await dialog.services.cxperium.report.sendAssistantReport(
			dialog.activity.from,
			prediction.intent ? prediction.intent : 'NOT FOUND',
			dialog.activity.text.length > 1
				? dialog.activity.text
				: dialog.activity.value.id,
			prediction.type ? prediction.type : 'NOT FOUND',
		);

		return prediction;
	}

	public async runWithIntentName(
		dialog: any,
		intentName: string,
	): Promise<void> {
		const runParams = await this.prepareRunParams(
			dialog,
			intentName,
			ExecutionParameters.RUN_DIALOG,
		);

		await this.runDynamicImport(
			runParams,
			undefined,
			ExecutionParameters.RUN_DIALOG,
		);
	}

	public async runMessageEvent(
		dialog: any,
		prediction: TIntentPrediction,
		event: EMessageEvent,
	) {
		const services: TAppLocalsServices = dialog.services;

		let findOneDialog;

		try {
			findOneDialog = this.getListAll.find((item: any) => {
				return item.name == ENTRY_INTENT_NAME;
			}) as any;
		} catch (error) {
			console.error('RUN MESSAGE EVENT: NOT FOUND MESSAGE EVENT!!!');
			throw error;
		}

		if (!findOneDialog)
			throw new Error('RUN MESSAGE EVENT: IMPLEMENTATION NOT FOUND!');

		const runParams: TBaseDialogCtor = {
			contact: dialog.contact,
			activity: dialog.activity,
			conversation: dialog.conversation,
			dialogFileParams: {
				name: findOneDialog.name,
				path: findOneDialog.path,
				place: `RUN MESSAGE EVENT: ${event}`,
			},
			services,
		};

		switch (event) {
			case EMessageEvent.ON_FILE_RECEIVED: {
				return await this.runOnFileReceived(runParams, event);
			}
			case EMessageEvent.ON_CHATGPT_MESSAGE: {
				return await this.runOnChatGPTMessage(
					runParams,
					prediction,
					event,
				);
			}
			case EMessageEvent.ON_DIALOGFLOW_MESSAGE: {
				return await this.runOnDialogflowMessage(
					runParams,
					prediction,
					event,
				);
			}
			case EMessageEvent.ON_DID_NOT_UNDERSTAND: {
				return await this.runOnDidNotUnderstand(runParams, event);
			}
		}
	}

	public async createReturnResponse(): Promise<ExecuteFlow> {
		return {
			execute: async (
				dialog: any,
				request: FlowRequest,
				intentName: string,
			): Promise<FlowResponse> => {
				console.log(dialog, request, intentName);

				const RETURN_RESPONSE = ExecutionParameters.RETURN_RESPONSE;

				const runParams = await this.prepareRunParams(
					dialog,
					intentName,
					RETURN_RESPONSE,
				);

				return await this.runDynamicImport(
					runParams,
					request,
					RETURN_RESPONSE,
				);
			},
		};
	}

	public async createRefreshOnBack(): Promise<ExecuteFlow> {
		return {
			execute: async (
				dialog: any,
				request: FlowRequest,
				intentName: string,
			): Promise<FlowResponse> => {
				console.log(dialog, request, intentName);

				const REFRESH_ON_BACK = ExecutionParameters.REFRESH_ON_BACK;

				const runParams = await this.prepareRunParams(
					dialog,
					intentName,
					REFRESH_ON_BACK,
				);

				return await this.runDynamicImport(
					runParams,
					request,
					REFRESH_ON_BACK,
				);
			},
		};
	}

	public async createReceiveFlow(): Promise<ExecuteFlow> {
		return {
			execute: async (
				dialog: any,
				request: FlowRequest | undefined,
				intentName: string,
			): Promise<FlowResponse> => {
				const RECEIVE_FLOW = ExecutionParameters.RECEIVE_FLOW;

				const runParams = await this.prepareRunParams(
					dialog,
					intentName,
					RECEIVE_FLOW,
				);

				return await this.runDynamicImport(
					runParams,
					request,
					RECEIVE_FLOW,
				);
			},
		};
	}

	public async createRunDialog(): Promise<ExecuteFlow> {
		return {
			execute: async (
				dialog: any,
				request: FlowRequest | undefined,
				intentName: string,
			): Promise<FlowResponse> => {
				const RUN_DIALOG = ExecutionParameters.RUN_DIALOG;

				const runParams = await this.prepareRunParams(
					dialog,
					intentName,
					RUN_DIALOG,
				);

				return await this.runDynamicImport(
					runParams,
					request,
					RUN_DIALOG,
				);
			},
		};
	}

	private async runDynamicImport(
		data: TBaseDialogCtor,
		body: FlowRequest | undefined,
		executionParam: ExecutionParameters,
	): Promise<FlowResponse> {
		console.info(
			`EXECUTING INTENT: ${data.dialogFileParams.name} - ${data.dialogFileParams.place}`,
		);

		const func = executionParamsMapping[executionParam];

		data.conversation.dialogFileParams = data.dialogFileParams;
		const dialogImport = await import(data.dialogFileParams.path);
		const dialog = new dialogImport.default(data);
		return await dialog[func](body);
	}

	private async findDialog(
		intentName: string,
		executionParam: ExecutionParameters,
	): Promise<any> {
		let dialog;

		try {
			dialog = this.getListAll.find((item: any) => {
				return item.name == intentName;
			}) as any;
		} catch (error) {
			console.error(
				`RUNNING ${executionParam}: Failed to execute ${intentName}!`,
			);
			throw error;
		}

		if (!dialog)
			throw new Error(
				`RUNNING ${executionParam}: Intent ${intentName} not found!`,
			);

		return dialog;
	}

	private async prepareRunParams(
		dialog: any,
		intentName: string,
		executionParam: ExecutionParameters,
	): Promise<TBaseDialogCtor> {
		const services: TAppLocalsServices = dialog.services;
		const intent = await this.findDialog(intentName, executionParam);

		const runParams: TBaseDialogCtor = {
			contact: dialog.contact,
			activity: dialog.activity,
			conversation: dialog.conversation,
			dialogFileParams: {
				name: intent.name,
				path: intent.path,
				place: executionParam,
			},
			services,
		};

		return runParams;
	}

	// public async runReturnFlowResponse(
	// 	dialog: any,
	// 	body: FlowRequest,
	// 	intentName: string,
	// ): Promise<FlowResponse> {
	// 	const services: TAppLocalsServices = dialog.services;

	// 	let findOneDialog;

	// 	try {
	// 		findOneDialog = this.getListAll.find((item: any) => {
	// 			return item.name == intentName;
	// 		}) as any;
	// 	} catch (error) {
	// 		console.error('RUN FLOW: NOT FOUND FLOW FILE!!!');
	// 		throw error;
	// 	}

	// 	if (!findOneDialog) throw new Error('RUN FLOW: NOT FOUND FLOW');

	// 	const runParams: TBaseDialogCtor = {
	// 		contact: dialog.contact,
	// 		activity: dialog.activity,
	// 		conversation: dialog.conversation,
	// 		dialogFileParams: {
	// 			name: findOneDialog.name,
	// 			path: findOneDialog.path,
	// 			place: 'RETURN_FLOW_RESPONSE',
	// 		},
	// 		services,
	// 	};

	// 	return await this.returnFlowResponse(runParams, body);
	// }

	// public async runReceiveFlow(
	// 	dialog: any,
	// 	intentName: string,
	// ): Promise<void> {
	// 	const runParams = await this.prepareRunParams(
	// 		dialog,
	// 		intentName,
	// 		ExecutionParameters.RECEIVE_FLOW,
	// 	);

	// 	await this.runDynamicImport(
	// 		runParams,
	// 		null,
	// 		ExecutionParameters.RECEIVE_FLOW,
	// 	);
	// }

	// public async returnFlowResponse(
	// 	data: TBaseDialogCtor,
	// 	body: any,
	// ): Promise<any> {
	// 	console.info(
	// 		`RETURNING FLOW RESPONSE: ${data.dialogFileParams.name} - ${data.dialogFileParams.place}`,
	// 	);

	// 	data.conversation.dialogFileParams = data.dialogFileParams;
	// 	const dialogImport = await import(data.dialogFileParams.path);
	// 	const dialog = new dialogImport.default(data);
	// 	return await dialog.returnResponse(body);
	// }

	// public async runFlow(data: TBaseDialogCtor): Promise<void> {
	// 	console.info(
	// 		`RUN FLOW: ${data.dialogFileParams.name} - ${data.dialogFileParams.place}`,
	// 	);

	// 	data.conversation.dialogFileParams = data.dialogFileParams;
	// 	const dialogImport = await import(data.dialogFileParams.path);
	// 	const dialog = new dialogImport.default(data);
	// 	await dialog.receiveFlow();
	// }

	public async runOnDidNotUnderstand(
		data: TBaseDialogCtor,
		event: EMessageEvent,
	): Promise<void> {
		console.info(`RUN MESSAGE EVENT: ${EMessageEvent[event]}`);

		try {
			data.conversation.dialogFileParams = data.dialogFileParams;
			const dialogImport = await import(data.dialogFileParams.path);
			const dialog = new dialogImport.default(data);
			await dialog.onDidNotUnderstand(dialog);
		} catch (error) {
			console.info(
				`${EMessageEvent[event]} is not implemented. You may want to implement IMessageEvent interface to your Entry.ts file if you require to customize the response! (NOT REQUIRED!)`,
			);
			throw new Error(`DID_NOT_UNDERSTAND_EVENT_NOT_IMPLEMENTED_ERROR`);
		}
	}

	public async runOnFileReceived(
		data: TBaseDialogCtor,
		event: EMessageEvent,
	): Promise<void> {
		console.info(`RUN MESSAGE EVENT: ${EMessageEvent[event]}`);

		try {
			data.conversation.dialogFileParams = data.dialogFileParams;
			const dialogImport = await import(data.dialogFileParams.path);
			const dialog = new dialogImport.default(data);
			await dialog.onFileReceived(dialog);
		} catch (error) {
			console.info(
				`${EMessageEvent[event]} is not implemented. You may want to IMessageEvent interface to your Entry.ts file if you require to customize the response! (NOT REQUIRED!)`,
			);
			throw new Error(`FILE_RECEIVED_EVENT_NOT_IMPLEMENTED_ERROR`);
		}
	}

	public async runOnChatGPTMessage(
		data: TBaseDialogCtor,
		prediction: TIntentPrediction,
		event: EMessageEvent,
	): Promise<void> {
		console.info(`RUN MESSAGE EVENT: ${EMessageEvent[event]}`);

		try {
			data.conversation.dialogFileParams = data.dialogFileParams;
			const dialogImport = await import(data.dialogFileParams.path);
			const dialog = new dialogImport.default(data);
			await dialog.onChatGPTMessage(prediction);
		} catch (error) {
			console.info(
				`${EMessageEvent[event]} is not implemented. You may want to IMessageEvent interface to your Entry.ts file if you require to customize the response! (NOT REQUIRED!)`,
			);
			throw new Error(`CHATGPT_EVENT_NOT_IMPLEMENTED_ERROR`);
		}
	}

	public async runOnDialogflowMessage(
		data: TBaseDialogCtor,
		prediction: TIntentPrediction,
		event: EMessageEvent,
	): Promise<void> {
		console.info(`RUN MESSAGE EVENT: ${EMessageEvent[event]}`);

		try {
			data.conversation.dialogFileParams = data.dialogFileParams;
			const dialogImport = await import(data.dialogFileParams.path);
			const dialog = new dialogImport.default(data);
			await dialog.onDialogflowMessage(prediction);
		} catch (error) {
			console.info(
				`${EMessageEvent[event]} is not implemented. You may want to IMessageEvent interface to your Entry.ts file if you require to customize the response! (NOT REQUIRED!)`,
			);
			throw new Error(`DIALOGFLOW_EVENT_NOT_IMPLEMENTED_ERROR`);
		}
	}

	// public async run(data: TBaseDialogCtor): Promise<void> {
	// 	console.info(
	// 		`RUN DIALOG: ${data.dialogFileParams.name} - ${data.dialogFileParams.place}`,
	// 	);

	// 	data.conversation.dialogFileParams = data.dialogFileParams;
	// 	const dialogImport = await import(data.dialogFileParams.path);
	// 	const dialog = new dialogImport.default(data);
	// 	await dialog.runDialog();
	// }

	public initList(folderPath: string, type: string): void {
		let data: any;

		data = listFilesAndFolders(folderPath);

		data = catchFileExtension(data);

		data = replaceFullPath(data, folderPath);

		this.listAll.push(...data);

		function replaceFullPath(array: string[], dialogPath: string): any {
			return array.map((file: string) => {
				const newFileArray = ['CXPerium.Dialogs'];
				const filePathReplace = file.replace(dialogPath, '');
				const pathDirection = String(process.platform).startsWith('win')
					? '\\'
					: '/';

				const filePathReplaceArray =
					filePathReplace.split(pathDirection);

				for (const index in filePathReplaceArray) {
					const element = filePathReplaceArray[index];
					const elementExtname = path.extname(element);
					const elementReplaceDeleteExtname = element.replace(
						elementExtname,
						'',
					);

					if (elementReplaceDeleteExtname) {
						newFileArray.push(elementReplaceDeleteExtname);
					}
				}
				return {
					path: file,
					name: newFileArray.join('.'),
				};
			});
		}

		function catchFileExtension(array: string[]): string[] {
			const catchFileExtension =
				NODE_ENV === 'development' && type == 'EXTERNAL'
					? '.ts'
					: '.js';
			const filterData: string[] = [];

			for (const file of array) {
				const fileBase = path.basename(file);
				const fileExtension = path.extname(fileBase);
				const fileExtensionDotControl = fileBase.split('.').length;

				if (
					fileExtension === catchFileExtension &&
					fileExtensionDotControl === 2
				) {
					filterData.push(file);
				}
			}

			return filterData;
		}

		function listFilesAndFolders(dirPath: string): string[] {
			let results: string[] = [];

			const list = fs.readdirSync(dirPath);

			list.forEach(function (file) {
				file = path.join(dirPath, file);

				const stat = fs.statSync(file);

				if (stat && stat.isDirectory()) {
					results = results.concat(listFilesAndFolders(file));
				} else {
					results.push(file);
				}
			});

			return results;
		}
	}
}
