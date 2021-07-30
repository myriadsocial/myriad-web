import {useState} from 'react';
import {useDispatch} from 'react-redux';

import {fetchWalletDetails} from 'src/reducers/timeline/actions';

export const useWalletAddress = (postId: string) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWalletDetails = async () => {
    setLoading(true);
    try {
      dispatch(fetchWalletDetails(postId));
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
