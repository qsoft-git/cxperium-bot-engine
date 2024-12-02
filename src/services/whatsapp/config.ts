const getConfig = async (configuration: any): Promise<any> => {
	return await configuration.execute();
};

export { getConfig };
