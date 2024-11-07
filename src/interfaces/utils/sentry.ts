// ? Types.
import { TSrcIndexConfig } from '../../types/src-index';
import * as Sentry from '@sentry/node';
import { Application } from 'express';

export interface IUtilsSentry {
	sentry: typeof Sentry;
	initSentryProperties: (data: TSrcIndexConfig, app: Application) => void;
	processOn: () => void;
}
