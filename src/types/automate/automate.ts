import ServiceAutomateUser from '../../services/automate/user';
import ServiceAutomateApi from '../../services/automate/api';

export type TAutomateServices = {
	user: ServiceAutomateUser;
	api: ServiceAutomateApi;
};
