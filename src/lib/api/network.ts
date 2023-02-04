import MyriadAPI from './base';

import {Network, NetworkIdEnum} from 'src/interfaces/network';

export const getNetwork = async (networkId: NetworkIdEnum): Promise<Network> => {
  try {
    const {data} = await MyriadAPI().request<Network>({
      url: `/networks/${networkId}`,
      method: 'GET',
    });

    return data;
  } catch {
    return;
  }
};
