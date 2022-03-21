import {Actions as BaseAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';
import {formatNumber} from 'src/helpers/balance';
import {BalanceDetail} from 'src/interfaces/balance';
import {CurrencyId} from 'src/interfaces/currency';
import * as TokenAPI from 'src/lib/api/token';
import {checkAccountBalance} from 'src/lib/services/polkadot-js';
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

export interface IncreaseBalance extends Action {
  type: constants.INCREASE_BALANCE;
  currencyId: CurrencyId;
  change: number;
}

export interface DecreaseBalance extends Action {
  type: constants.DECREASE_BALANCE;
  currencyId: CurrencyId;
  change: number;
}

/**
 * Union Action Types
 */

export type Actions =
  | FetchBalances
  | IncreaseBalance
  | DecreaseBalance
  | FetchCurrenciesId
  | BaseAction;

/**
 *
 * Actions
 */
export const increaseBalance = (currencyId: CurrencyId, change: number): IncreaseBalance => ({
  type: constants.INCREASE_BALANCE,
  currencyId,
  change,
});

export const decreaseBalance = (currencyId: CurrencyId, change: number): DecreaseBalance => ({
  type: constants.DECREASE_BALANCE,
  currencyId,
  change,
});

/**
 * Action Creator
 */

export const fetchBalances: ThunkActionCreator<Actions, RootState> =
  () => async (dispatch, getState) => {
    const {
      userState: {currencies, user, anonymous},
    } = getState();

    let address = '';

    if (anonymous || !user) return;

    // Only parse address to fetch balance when wallets are successfully fetched
    if ('wallets' in user && user?.wallets?.length) {
      address = user.wallets[0].id;
    } else {
      return;
    }

    const tokenBalances: BalanceDetail[] = [];

    dispatch(setLoading(true));

    try {
      for (const currency of currencies) {
        const {free, nonce} = await checkAccountBalance(address, currency, change => {
          const amount = formatNumber(+change.toString(), currency.decimal);

          if (amount > 0) {
            dispatch(increaseBalance(currency.id, amount));
          } else {
            dispatch(decreaseBalance(currency.id, Math.abs(amount)));
          }
        });

        tokenBalances.push({
          ...currency,
          originBalance: formatNumber(+free.toString(), currency.decimal),
          freeBalance: formatNumber(+free.toString(), currency.decimal),
          previousNonce: nonce ? +nonce.toString() : 0,
        });
      }

      dispatch({
        type: constants.FETCH_BALANCES,
        balanceDetails: tokenBalances,
      });
    } catch (error) {
      dispatch(
        setError({
          title: 'something is wrong',
          message: 'There are some issues when connecting to RPC',
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
