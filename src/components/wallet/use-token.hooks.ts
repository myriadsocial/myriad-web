import { useState } from 'react';

import { useToken as baseUseToken, TokenActionType } from './token.context';

import * as TokenAPI from 'src/lib/api/token';

export const useToken = () => {
  const { state, dispatch } = baseUseToken();

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
        payload: data
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
      const data = await TokenAPI.addNewToken({
        tokenId,
        userId
      });

      //console.log('the data is: ', data);
      if (data) {
        setIsTokenAddSuccess(true);
        setErrorUserTokens(null);
      }

      dispatch({
        type: TokenActionType.ADD_TOKEN,
        payload: data
      });
    } catch (error) {
      setErrorUserTokens(error.response.status);
    } finally {
      setLoading(false);
    }
  };

  const resetErrorUserTokens = () => {
    setErrorUserTokens(null);
  };

  return {
    isTokenAddSuccess,
    resetErrorUserTokens,
    errorUserTokens,
    errorTokens,
    loading,
    loadAllTokens,
    addUserToken,
    tokens: state.tokens
  };
};
