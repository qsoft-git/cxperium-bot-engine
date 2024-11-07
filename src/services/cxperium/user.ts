// ? Types.
import { TCxperiumServiceParams } from '../../types/cxperium/service';

// ? Services.
import ServiceCxperium from '.';

export default class extends ServiceCxperium {
	constructor(data: TCxperiumServiceParams) {
		super(data);
	}
}
