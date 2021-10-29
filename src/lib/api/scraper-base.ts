import getConfig from 'next/config';

import axios, {AxiosInstance} from 'axios';

const {publicRuntimeConfig} = getConfig();

let ScraperAPI: AxiosInstance;

export const initializeScraperApi = (): AxiosInstance => {
  if (!ScraperAPI) {
    ScraperAPI = axios.create({
      baseURL: publicRuntimeConfig.scraperBaseURL,
    });
  }

  return ScraperAPI;
};

export default initializeScraperApi();
