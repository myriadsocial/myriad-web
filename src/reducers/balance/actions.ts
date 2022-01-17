import {Actions as BaseAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';
import {formatNumber} from 'src/helpers/balance';
import {BalanceDetail} from 'src/interfaces/balance';
import {Currency} from 'src/interfaces/currency';
import * as TokenAPI from 'src/lib/api/token';
import {connectToBlockchain} from 'src/lib/services/polkadot-js';
import {ThunkActionCreator} from 'src/types/thunk';

/**
 * Action Types
 */

export interface FetchBalances extends Action {
  type: constants.FETCH_BALANCES;
  balanceDetails: BalanceDetail[];
}

export interface FetchCurrenciesId extends Action {
  type: constants.FETCH_CURRENCIES_ID;
  currenciesId: string[];
}

/**
 * Union Action Types
 */

export type Actions = FetchBalances | BaseAction | FetchCurrenciesId;

/**
 * Action Creator
 */

export const fetchBalances: ThunkActionCreator<Actions, RootState> =
  (address: string, availableTokens: Currency[]) => async dispatch => {
    dispatch(setLoading(true));
    const tokenBalances = [];

    try {
      for (let i = 0; i < availableTokens.length; i++) {
        const provider = availableTokens[i].rpcURL;
        const api = await connectToBlockchain(provider);

        if (api) {
          if (availableTokens[i].native) {
            const {data: balance} = await api.query.system.account(address);
            const tempBalance = balance.free as unknown;
            tokenBalances.push({
              freeBalance: formatNumber(tempBalance as number, availableTokens[i].decimal),
              id: availableTokens[i].id,
              decimal: availableTokens[i].decimal,
              rpcURL: provider,
              image: availableTokens[i].image,
              native: availableTokens[i].native,
            });
          } else {
            const tokenData: any = await api.query.tokens.accounts(address, {
              TOKEN: availableTokens[i].id,
            });
            tokenBalances.push({
              freeBalance: formatNumber(tokenData.free as number, availableTokens[i].decimal),
              id: availableTokens[i].id,
              decimal: availableTokens[i].decimal,
              rpcURL: provider,
              image: availableTokens[i].image,
              native: availableTokens[i].native,
            });
          }

          await api.disconnect();
        }
      }

      dispatch({
        type: constants.FETCH_BALANCES,
        balanceDetails: tokenBalances,
      });
    } catch (error) {
      dispatch(
        setError({
          title: 'something is wrong',
          message: 'ooopps!',
        }),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getUserCurrencies: ThunkActionCreator<Actions, RootState> =
  () => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      const {data} = await TokenAPI.getUserCurrencies(user.id);
      const currenciesId = data.map(currency => currency.currencyId);
      dispatch({
        type: constants.FETCH_CURRENCIES_ID,
        currenciesId,
      });
    } catch (error) {
      dispatch(
        setError({
          message: error.message,
        }),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };
