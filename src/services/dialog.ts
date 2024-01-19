// Environment.
const { NODE_ENV } = process.env;

// Node modules.
import * as fs from 'fs';
import * as path from 'path';

// Types.
import { TBaseDialogCtor, TAppLocalsServices } from '../types/base-dialog';
import BaseConversation from './conversation';
import { TIntentPrediction } from '../types/intent-prediction';

// Services.
import ServiceDialogflow from './dialogflow/match';
import ServiceChatGPT from './chatgpt/match';

const CHANNELS: Record<string, any> = {
	WHATSAPP: '1',
	TEAMS: '3',
	WEBCHAT: '4',
};

export default class {
	private folderPathExternal!: string;
	private folderPathInternal!: string;
	private listAll: { name: string; path: string }[] = [];

	constructor(_dialogPath: string) {
		this.folderPathExternal = _dialogPath;
		this.folderPathInternal = path.join(__dirname, '../dialogs');
		this.initList(this.folderPathExternal, 'EXTERNAL');
		this.initList(this.folderPathInternal, 'INTERNAL');
	}

	public get getListAll() {
		return this.listAll;
	}

	public async runWithConversationWaitAction(dialog: any): Promise<boolean> {
		const conversation: BaseConversation = dialog.conversation;

		if (!conversation.isWaitAny()) return false;

		let findOneDialog;

		try {
			findOneDialog = this.getListAll.find(
				(item: any) =>
					conversation.conversation.waitData.className === item?.name,
			) as any;
		} catch (error) {
			console.error('RUN DIALOG: NOT FOUND DIALOG FILE!!!');
			throw error;
		}

		if (!findOneDialog) throw new Error('RUN DIALOG: NOT FOUND DIALOG');

		const runParams: TBaseDialogCtor = {
			contact: dialog.contact,
			activity: dialog.activity,
			conversation: dialog.conversation,
			dialogFileParams: {
				name: findOneDialog.name,
				path: findOneDialog.path,
				place: 'RUN_WITH_CONVERSATION_WAIT_ACTION',
			},
			context: dialog.context,
			services: dialog.services,
		};

		await this.run(runParams);

		return true;
	}

	public async runWithMatch(dialog: any): Promise<void> {
		const services: TAppLocalsServices = dialog.services;
		const prediction: TIntentPrediction =
			await this.intentPrediction(dialog);

		if (prediction.isMatch && prediction.fulfillment) {
			if (dialog.place == 'WHATSAPP') {
				await dialog.services.whatsapp.message.sendRegularMessage(
					dialog.contact.phone,
					prediction.fulfillment,
				);
			} else if (dialog.place == 'TEAMS' || dialog.place == 'WEBCHAT') {
				await dialog.context.sendActivity(prediction.fulfillment);
			}
			return;
		}

		if (prediction.isMatch && prediction.intent) {
			let findOneDialog;

			try {
				findOneDialog = this.getListAll.find(
					(item: any) => prediction.intent === item?.name,
				) as any;
			} catch (error) {
				console.error('RUN DIALOG: NOT FOUND DIALOG FILE!!!');
				throw error;
			}

			if (!findOneDialog) throw new Error('RUN DIALOG: NOT FOUND DIALOG');

			const runParams: TBaseDialogCtor = {
				contact: dialog.contact,
				activity: dialog.activity,
				conversation: dialog.conversation,
				dialogFileParams: {
					name: findOneDialog.name,
					path: findOneDialog.path,
					place: 'RUN_WITH_MATCH',
				},
				context: dialog.context,
				services,
			};

			await this.run(runParams);
		} else {
			if (dialog.place == 'WHATSAPP') {
				await this.runWithIntentName(
					dialog,
					'CXPerium.Dialogs.WhatsApp.System.Unknown.IntentNotFoundDialog',
				);
			} else if (dialog.place == 'TEAMS' || dialog.place == 'WEBCHAT') {
				await this.runWithIntentName(
					dialog,
					'CXPerium.Dialogs.Teams.System.Unknown.IntentNotFoundDialog',
				);
			}
		}
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

		let activity: any;

		if (dialog.place == 'WHATSAPP') {
			activity = dialog.activityToText();
		} else if (dialog.place == 'TEAMS' || dialog.place == 'WEBCHAT') {
			if (dialog.activity.value)
				activity = Object.values(dialog.activity.value)[0];
			else activity = dialog.activity.text;
		} else {
			throw new Error('RUN DIALOG: NOT FOUND PLACE!!!');
		}

		const cxperiumAllIntents = services.cxperium.intent.cache.get(
			'all-intents',
		) as any;

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
		}

		if (!prediction.isMatch && Boolean(env.dialogflowConfig.IsEnable)) {
			const df = new ServiceDialogflow(services);
			prediction = await df.dialogflowMatch(
				activity,
				dialog.contact._id,
				dialog.conversation.conversation.cultureCode,
			);
		}

		if (!prediction.isMatch && Boolean(env.chatgptConfig.IsEnabled)) {
			const chatgptService = new ServiceChatGPT(services);
			prediction = await chatgptService.chatGPTMatch(activity);
		}

		return prediction;
	}

	public async runWithIntentName(
		dialog: any,
		intentName: string,
	): Promise<void> {
		const services: TAppLocalsServices = dialog.services;

		let findOneDialog;

		try {
			findOneDialog = this.getListAll.find((item: any) => {
				return item.name == intentName;
			}) as any;
		} catch (error) {
			console.error('RUN DIALOG: NOT FOUND DIALOG FILE!!!');
			throw error;
		}

		if (!findOneDialog) throw new Error('RUN DIALOG: NOT FOUND DIALOG');

		const runParams: TBaseDialogCtor = {
			contact: dialog.contact,
			activity: dialog.activity,
			conversation: dialog.conversation,
			dialogFileParams: {
				name: findOneDialog.name,
				path: findOneDialog.path,
				place: 'RUN_WITH_INTENT_NAME',
			},
			context: dialog.context,
			services,
		};

		await this.run(runParams);
	}

	public async run(data: TBaseDialogCtor): Promise<void> {
		console.info(
			`RUN DIALOG: ${data.dialogFileParams.name} - ${data.dialogFileParams.place}`,
		);

		data.conversation.dialogFileParams = data.dialogFileParams;
		const dialogImport = await import(data.dialogFileParams.path);
		const dialog = new dialogImport.default(data);
		await dialog.runDialog();
	}

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
