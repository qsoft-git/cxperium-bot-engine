import { TSrcIndexConfig } from '../../types/src-index';

export interface IUtilsWorker {
	initWorkers: (data: TSrcIndexConfig) => void;
}
