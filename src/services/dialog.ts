// ? Environment.
const { NODE_ENV, RESET_KEY } = process.env;

// ? Node modules.ms
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
import { TChatGPTResponse } from '../types/chatgpt/response';
import { EMessageEvent } from '../types/message-event';
import {
	ExecutionInterface,
	executionParamsMapping,
} from '../types/whatsapp/flow';
import { Dialog } from '../types/dialog';

// ? Interfaces.
import { IHandler } from './event-handler/IHandler';
import { ExecuteFlow } from '../interfaces/flow';
import { IMessageStrategy } from './strategies/message/IMessageStrategy';

// ? Services.
import ServiceChatGPT from './chatgpt/match';
import { activityToText } from './init-activity';
import BaseConversation from './conversation';
import { ConcreteHandler } from './event-handler/ConcreteAbstractions';
import { DynamicHandler } from './event-handler/DynamicHandler';
import { IntentMatcher } from './strategies/prediction/IntentMatcher';
import { FileReceivedStrategy } from './strategies/message/FileReceivedStrategy';
import { DialogflowMessageStrategy } from './strategies/message/DialogflowMessageStrategy';
import { ChatGptMessageStrategy } from './strategies/message/ChatGPTMessageStrategy';
import { DidNotUnderstandStrategy } from './strategies/message/DidNotUnderstandStrategy';
import { IntentStrategy } from './strategies/message/RegexMessageStrategy';

export const CHANNELS: Record<string, any> = {
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
			ExecutionInterface.RUN_DIALOG,
		);

		await this.runDynamicImport(
			runParams,
			undefined,
			ExecutionInterface.RUN_DIALOG,
		);

		return true;
	}

	public async runMessageEvent(
		dialog: Dialog,
		prediction: TIntentPrediction,
		event: EMessageEvent,
	): Promise<void> {
		const runParams = await this.prepareRunParams(
			dialog,
			ENTRY_INTENT_NAME,
			ExecutionInterface[event],
		);

		const handler: IHandler = new DynamicHandler();
		const concrete = new ConcreteHandler(handler);

		await concrete.handle(event, runParams, prediction);
	}

	public async runWithMatch(dialog: Dialog): Promise<void> {
		const prediction: TIntentPrediction =
			await this.intentPrediction(dialog);
		const isFile =
			dialog.activity.image.id ||
			dialog.activity.document.id ||
			dialog.activity.video.id;

		let strategy: IMessageStrategy;

		if (isFile) {
			strategy = new FileReceivedStrategy();
		} else {
			if (prediction.isMatch && prediction.fulfillment) {
				strategy = new DialogflowMessageStrategy();
			} else if (prediction.isMatch && prediction.chatgptMessage) {
				strategy = new ChatGptMessageStrategy();
			} else if (prediction.isMatch && prediction.intent) {
				strategy = new IntentStrategy();
			} else {
				strategy = new DidNotUnderstandStrategy();
			}
		}

		await strategy.handle(dialog, prediction);
	}

	public async runWithAi(dialog: Dialog, activity: string): Promise<any> {
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

	public async runWithAiFrom(dialog: Dialog, activity: string): Promise<any> {
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

	private async intentPrediction(dialog: Dialog): Promise<TIntentPrediction> {
		const activity = activityToText(dialog.activity);

		if (RESET_KEY && RESET_KEY === activity) {
			console.log('!!! Server shutdown request sent !!!');
			process.exit(137);
		}

		const intentMatcher = new IntentMatcher();
		const prediction = await intentMatcher.match(dialog, activity);

		await dialog.services.cxperium.report.sendAssistantReport(
			dialog.activity.from,
			prediction.intent ? prediction.intent : 'NOT FOUND',
			activity,
			prediction.type ? prediction.type : 'NOT FOUND',
		);

		return prediction;
	}

	public async runWithIntentName(
		dialog: Dialog,
		intentName: string,
	): Promise<void> {
		const runParams = await this.prepareRunParams(
			dialog,
			intentName,
			ExecutionInterface.RUN_DIALOG,
		);

		await this.runDynamicImport(
			runParams,
			undefined,
			ExecutionInterface.RUN_DIALOG,
		);
	}

	public async createReturnResponse(): Promise<ExecuteFlow> {
		return {
			execute: async (
				dialog: any,
				request: FlowRequest,
				intentName: string,
			): Promise<FlowResponse> => {
				const RETURN_RESPONSE = ExecutionInterface.RETURN_RESPONSE;

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

				const REFRESH_ON_BACK = ExecutionInterface.REFRESH_ON_BACK;

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
				const RECEIVE_FLOW = ExecutionInterface.RECEIVE_FLOW;

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
				dialog: Dialog,
				request: FlowRequest | undefined,
				intentName: string,
			): Promise<FlowResponse> => {
				const RUN_DIALOG = ExecutionInterface.RUN_DIALOG;

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

	public async runDynamicImport(
		data: TBaseDialogCtor,
		body: FlowRequest | undefined,
		executionParam: ExecutionInterface,
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

	public async findDialog(
		intentName: string,
		executionParam: ExecutionInterface,
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

	public async prepareRunParams(
		dialog: Dialog,
		intentName: string,
		executionParam: ExecutionInterface,
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

	private initList(folderPath: string, type: string): void {
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
