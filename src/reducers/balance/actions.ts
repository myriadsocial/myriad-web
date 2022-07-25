import {signOut} from 'next-auth/react';
import getConfig from 'next/config';

import {Actions as BaseAction, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';
import {formatNumber} from 'src/helpers/balance';
import {BalanceDetail} from 'src/interfaces/balance';
import {Currency, CurrencyId} from 'src/interfaces/currency';
import {User} from 'src/interfaces/user';
import * as TokenAPI from 'src/lib/api/token';
import {getNearBalanceV2} from 'src/lib/services/near-api-js';
import {checkAccountBalance, connectToBlockchain} from 'src/lib/services/polkadot-js';
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

export interface BalanceLoading extends Action {
  type: constants.BALANCE_LOADING;
  loading: boolean;
}

/**
 * Union Action Types
 */

export type Actions =
  | FetchBalances
  | IncreaseBalance
  | DecreaseBalance
  | FetchCurrenciesId
  | BalanceLoading
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

export const setBalanceLoading = (loading: boolean): BalanceLoading => ({
  type: constants.BALANCE_LOADING,
  loading,
});

/**
 * Action Creator
 */

export type RetrieveBalanceProps = {
  originBalance: number;
  freeBalance: number;
  previousNonce: number;
};

export const fetchBalances: ThunkActionCreator<Actions, RootState> =
  (force = false, status = 'finalized') =>
  async (dispatch, getState) => {
    const {
      userState: {user, anonymous, currentWallet},
      balanceState: {initialized},
    } = getState();

    if (status === 'onProgress') {
      return dispatch(setBalanceLoading(true));
    }

    if (anonymous || !user || (initialized && !force)) return;

    if (currentWallet?.network?.blockchainPlatform === 'substrate') {
      dispatch(fetchBalancesPolkadot(user));
    }

    if (currentWallet?.network?.blockchainPlatform === 'near') {
      dispatch(fetchBalancesNear(user));
    }
  };

export const fetchBalancesPolkadot: ThunkActionCreator<Actions, RootState> =
  (user: User) => async (dispatch, getState) => {
    const {
      userState: {currencies},
    } = getState();
    // Only parse address to fetch balance when wallets are successfully fetched
    if (!('wallets' in user) || user.wallets?.length === 0) return;
    if (!user.wallets[0]?.network?.rpcURL) return;

    const address = user.wallets[0].id;
    const rpcURL = user.wallets[0].network.rpcURL;

    dispatch(setBalanceLoading(true));

    try {
      const api = await connectToBlockchain(rpcURL);
      const retrieveBalance = async (currency: Currency): Promise<RetrieveBalanceProps> => {
        const {free, nonce} = await checkAccountBalance(api, address, currency, change => {
          const amount = formatNumber(+change.toString(), currency.decimal);
          if (amount > 0) {
            dispatch(increaseBalance(currency.symbol, amount));
          } else {
            dispatch(decreaseBalance(currency.symbol, Math.abs(amount)));
          }
        });

        return {
          originBalance: formatNumber(+free.toString(), currency.decimal),
          freeBalance: formatNumber(+free.toString(), currency.decimal),
          previousNonce: nonce ? +nonce.toString() : 0,
        };
      };

      const balanceDetails: BalanceDetail[] = await Promise.all(
        currencies.map(async currency => {
          const {originBalance, freeBalance, previousNonce} = await retrieveBalance(currency);
          return {
            ...currency,
            originBalance,
            freeBalance,
            previousNonce,
          };
        }),
      );

      dispatch({
        type: constants.FETCH_BALANCES,
        balanceDetails,
      });
    } catch {
      dispatch({
        type: constants.FETCH_BALANCES,
        balanceDetails: currencies.map(currency => {
          return {
            ...currency,
            originBalance: NaN,
            freeBalance: NaN,
            previousNonce: 0,
          };
        }),
      });
    } finally {
      dispatch(setBalanceLoading(false));
    }
  };

export const fetchBalancesNear: ThunkActionCreator<Actions, RootState> =
  (user: User) => async (dispatch, getState) => {
    const {
      userState: {currencies},
    } = getState();

    // Only parse address to fetch balance when wallets are successfully fetched
    if (!('wallets' in user) || user.wallets?.length === 0) return;
    if (!user.wallets[0]?.network) return;

    dispatch(setBalanceLoading(true));

    const currentWallet = user.wallets[0];

    try {
      const retrieveBalance = async (currency: Currency): Promise<RetrieveBalanceProps> => {
        const {balance} = await getNearBalanceV2(
          currentWallet.network.rpcURL,
          currentWallet.id,
          currency.referenceId,
          currency.decimal,
        );

        return {
          originBalance: parseFloat(balance.replace(/,/g, '')),
          freeBalance: parseFloat(balance.replace(/,/g, '')),
          previousNonce: 0,
        };
      };

      const balanceDetails: BalanceDetail[] = await Promise.all(
        currencies.map(async currency => {
          const {originBalance, freeBalance, previousNonce} = await retrieveBalance(currency).catch(
            () => {
              return {
                originBalance: NaN,
                freeBalance: NaN,
                previousNonce: 0,
              };
            },
          );

          return {
            ...currency,
            originBalance: originBalance,
            freeBalance: freeBalance,
            previousNonce: previousNonce,
          };
        }),
      );

      dispatch({
        type: constants.FETCH_BALANCES,
        balanceDetails,
      });
    } catch {
      dispatch({
        type: constants.FETCH_BALANCES,
        balanceDetails: currencies.map(currency => {
          return {
            ...currency,
            originBalance: NaN,
            freeBalance: NaN,
            previousNonce: 0,
          };
        }),
      });
    } finally {
      dispatch(setBalanceLoading(false));
    }
  };

export const getUserCurrencies: ThunkActionCreator<Actions, RootState> =
  () => async (dispatch, getState) => {
    dispatch(setBalanceLoading(true));

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
      dispatch(setError(error));
    } finally {
      dispatch(setBalanceLoading(false));
    }
  };

export const sortBalances: ThunkActionCreator<Actions, RootState> =
  (balanceDetails: BalanceDetail[]) => async dispatch => {
    dispatch({
      type: constants.FETCH_BALANCES,
      balanceDetails: balanceDetails,
    });
  };
