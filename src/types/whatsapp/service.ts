import ServiceWhatsAppMessage from '../../services/whatsapp/message';
import ServiceWhatsAppMedia from '../../services/whatsapp/media';

export type TWhatsAppServices = {
	message: ServiceWhatsAppMessage;
	media: ServiceWhatsAppMedia;
};
