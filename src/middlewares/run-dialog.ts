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
import ServiceTeamsRunDialog from '../services/microsoft/teams/run-dialog';
import ServiceWebchatRunDialog from '../services/microsoft/webchat/run-dialog';
import { TCxperiumEnvironment } from '../types/configuration/environment';

export default class {
	static async executeWhatsapp(req: Request, res: Response): Promise<void> {
		res.send();

		if (!req.body.messages && !req.body.object) return;
		if (
			req.body.object === 'whatsapp_business_account' &&
			!req?.body?.entry?.[0]?.changes?.[0]?.value?.messages
		)
			return;

		try {
			const serviceRunDialog = new ServiceWhatsappRunDialog(req);
			await serviceRunDialog.execute();
		} catch (error) {
			const sentry = res.app.locals.service.sentry;
			sentry.captureException(error);
			console.error(error);
		}
	}

	static async executeMicrosoft(req: Request, res: Response): Promise<void> {
		try {
			const configuration: TCxperiumEnvironment =
				await res.app.locals.service.cxperium.configuration.execute();
			const config = {
				MicrosoftAppId: configuration.botframeworkConfig.MicrosoftAppId,
				MicrosoftAppPassword:
					configuration.botframeworkConfig.MicrosoftAppPassword,
			};

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
			const sentry = res.app.locals.service.sentry;
			sentry.captureException(error);
			console.error(error);
		}
	}
}

class Teams extends ActivityHandler {
	constructor(req: Request) {
		super();
		this.onMessage(async (context, next) => {
			if (req.body.channelId == 'webchat') {
				const serviceWebchatRunDialog = new ServiceWebchatRunDialog(
					req,
					context,
				);
				await serviceWebchatRunDialog.execute();
			} else {
				const serviceTeamsRunDialog = new ServiceTeamsRunDialog(
					req,
					context,
				);
				await serviceTeamsRunDialog.execute();
			}

			await next();
		});
	}
}
