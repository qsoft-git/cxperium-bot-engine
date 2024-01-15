// Node modules.
import { Request, Response } from 'express';
import {
	CloudAdapter,
	ConfigurationBotFrameworkAuthentication as BfAuthentication,
	ConfigurationBotFrameworkAuthenticationOptions as BfAuthOptions,
	ActivityHandler,
} from 'botbuilder';

// Services.
import ServiceWhatsappRunDialog from '../services/whatsapp/run-dialog';
import ServiceTeamsRunDialog from '../services/teams/run-dialog';
// import ServiceWebChatRunDialog from '../services/webchat/run-dialog';

const config = {
	MicrosoftAppId: '6bf35879-3b0e-414f-bf8c-e6ed2d409cae',
	MicrosoftAppPassword: '6s58Q~AXLAXIi~kmF8qZacvvFPULe7a-nufflc.u',
};

export default class {
	static async executeWhatsapp(req: Request, res: Response): Promise<void> {
		res.send();

		if (!req.body.messages) return;

		try {
			const serviceRunDialog = new ServiceWhatsappRunDialog(req);
			await serviceRunDialog.execute();
		} catch (error) {
			console.error(error);
		}
	}

	static async executeTeams(req: Request, res: Response): Promise<void> {
		try {
			const auth = new BfAuthentication(config as BfAuthOptions);
			const adapter = new CloudAdapter(auth);

			const onTurnErrorHandler = async (context: any, error: unknown) => {
				console.error(`\n [onTurnError] unhandled error: ${error}`);

				await context.sendTraceActivity(
					'OnTurnError Trace',
					error,
					'https://www.botframework.com/schemas/error',
					'TurnError',
				);

				await context.sendActivity(
					'The bot encountered an error or bug.',
				);
				await context.sendActivity(
					'To continue to run this bot, please fix the bot source code.',
				);
			};

			adapter.onTurnError = onTurnErrorHandler;

			const teamsBot = new Teams(req);

			await adapter.process(req, res, (context) => teamsBot.run(context));
		} catch (error) {
			console.error(error);
		}
	}
}

class Teams extends ActivityHandler {
	constructor(req: Request) {
		super();
		this.onMessage(async (context, next) => {
			const serviceRunDialog = new ServiceTeamsRunDialog(req, context);
			await serviceRunDialog.execute();
			await next();
		});
	}
}
