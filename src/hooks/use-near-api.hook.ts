import {connectToNearWallet, NearConnectResponseProps} from 'src/lib/services/near-api-js';

export const useNearApi = () => {
  const connectToNear = async (): Promise<NearConnectResponseProps> => {
    const data = connectToNearWallet();
    return data;
  };

  return {
    connectToNear,
  };
};
