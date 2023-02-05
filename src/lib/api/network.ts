import MyriadAPI from './base';

import axios from 'axios';
import {Network, NetworkIdEnum} from 'src/interfaces/network';

export const getNetwork = async (networkId: NetworkIdEnum, apiURL?: string): Promise<Network> => {
  try {
    if (apiURL) {
      const {data} = await axios({
        url: `${apiURL}/networks/${networkId}`,
        method: 'GET',
      });

      return data;
    }

    const {data} = await MyriadAPI().request<Network>({
      url: `/networks/${networkId}`,
      method: 'GET',
    });

    return data;
  } catch {
    return;
  }
};
