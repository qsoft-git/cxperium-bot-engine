// Node Modules.
import fetchBuilder from 'fetch-retry-ts';

const OPTIONS = {
	retries: 3,
	retryDelay: 1000,
};

const fetchRetry = fetchBuilder(global.fetch, OPTIONS);

export default fetchRetry;
