import {useState} from 'react';

import {useToken as baseUseToken, TokenActionType} from 'src/components/wallet/token.context';
import * as TokenAPI from 'src/lib/api/token';

export const useToken = (userId: string) => {
  const {state, dispatch} = baseUseToken();

  const [loading, setLoading] = useState(true);
  const [isTokenAddSuccess, setIsTokenAddSuccess] = useState(false);
  const [errorUserTokens, setErrorUserTokens] = useState(null);
  const [errorTokens, setErrorTokens] = useState(null);

  const loadAllTokens = async () => {
    setLoading(true);

    try {
      const data = await TokenAPI.getTokens();

      dispatch({
        type: TokenActionType.INIT_TOKEN,
        payload: data,
      });
    } catch (error) {
      setErrorTokens(error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllUserTokens = async () => {
    setLoading(true);

    try {
      const data = await TokenAPI.getUserTokens({
        id: userId,
      });

      dispatch({
        type: TokenActionType.INIT_USER_TOKEN,
        payload: data,
      });
    } catch (error) {
      setErrorTokens(error);
    } finally {
      setLoading(false);
    }
  };

  const addUserToken = async (tokenId: string, userId: string) => {
    setLoading(true);

    try {
      const data = await TokenAPI.addUserToken({
        tokenId,
        userId,
      });

      if (data) {
        setIsTokenAddSuccess(true);
        setErrorUserTokens(null);

        dispatch({
          type: TokenActionType.ADD_TOKEN,
          payload: data,
        });
      }
    } catch (error) {
      setErrorUserTokens(error.response.status);
    } finally {
      setLoading(false);
    }
  };

  const resetErrorUserTokens = () => {
    setErrorUserTokens(null);
  };

  const resetIsTokenAddSuccess = () => {
    setIsTokenAddSuccess(false);
  };

  return {
    isTokenAddSuccess,
    resetIsTokenAddSuccess,
    resetErrorUserTokens,
    errorUserTokens,
    errorTokens,
    loading,
    loadAllUserTokens,
    loadAllTokens,
    addUserToken,
    tokens: state.tokens,
    userTokens: state.userTokens,
  };
};
