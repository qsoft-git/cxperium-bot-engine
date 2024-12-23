import { TIntentPrediction } from '../../../types/intent-prediction';

interface IMessageStrategy {
	handle(dialog: any, prediction: TIntentPrediction): Promise<void>;
}

export { IMessageStrategy };
