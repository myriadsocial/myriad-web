import {useState} from 'react';
import {useDispatch} from 'react-redux';

import {ContentType} from 'src/interfaces/wallet';
import * as WalletAddressAPI from 'src/lib/api/wallet';
import {fetchWalletDetails} from 'src/reducers/timeline/actions';

export const useWalletAddress = (postId: string) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWalletDetails = async () => {
    setLoading(true);
    try {
      const {walletAddress} = await WalletAddressAPI.getWalletAddress(postId);

      const walletDetailPayload = {
        walletAddress,
        postId,
        contentType: ContentType.POST,
      };

      dispatch(fetchWalletDetails(walletDetailPayload));
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    loadWalletDetails,
  };
};
