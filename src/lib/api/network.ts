import MyriadAPI from './base';

import {Network, NetworkTypeEnum} from 'src/interfaces/network';

export const getNetwork = async (networkId: NetworkTypeEnum): Promise<Network> => {
  const {data} = await MyriadAPI().request<Network>({
    url: `/networks/${networkId}`,
    method: 'GET',
  });

  return data;
};
