// Services.
import ServiceCxperium from '.';

// Interfaces.
import { ICxperiumParams } from '../../interfaces/services/cxperium';

export default class extends ServiceCxperium {
	constructor(data: ICxperiumParams) {
		super(data);
	}
}
