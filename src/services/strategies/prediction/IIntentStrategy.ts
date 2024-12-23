import { Dialog } from '../../../types/dialog';
import { TIntentPrediction } from '../../../types/intent-prediction';

interface IIntentStrategy {
	match(dialog: Dialog, activity: string): Promise<TIntentPrediction>;
}

export { IIntentStrategy };
