import {Actions as BaseAction, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';
import {formatNumber} from 'src/helpers/balance';
import {BalanceDetail} from 'src/interfaces/balance';
import {IProvider} from 'src/interfaces/blockchain-interface';
import {Currency, CurrencyId} from 'src/interfaces/currency';
import * as TokenAPI from 'src/lib/api/token';
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

export const loadBalances: ThunkActionCreator<Actions, RootState> =
  (provider: IProvider, force = false) =>
  async (dispatch, getState) => {
    const {
      userState: {user, currencies, anonymous},
      balanceState: {initialized},
    } = getState();

    dispatch(setBalanceLoading(true));

    if (anonymous || !user || (initialized && !force)) return;

    // Only parse address to fetch balance when wallets are successfully fetched
    if (!('wallets' in user) || user.wallets?.length === 0) return;
    if (!user.wallets[0]?.network) return;

    try {
      if (!provider) throw new Error('NotConnected');

      const retrieveBalance = async (currency: Currency): Promise<RetrieveBalanceProps> => {
        const {balance, nonce} = await provider.balances(
          currency.decimal,
          currency.referenceId,
          change => {
            const amount = formatNumber(+change.toString(), currency.decimal);
            if (amount > 0) {
              dispatch(increaseBalance(currency.symbol, amount));
            } else {
              dispatch(decreaseBalance(currency.symbol, Math.abs(amount)));
            }
          },
        );

        return {
          originBalance: parseFloat(balance.replace(/,/g, '')),
          freeBalance: parseFloat(balance.replace(/,/g, '')),
          previousNonce: nonce ? +nonce.toString() : 0,
        };
      };

      const balanceDetails: BalanceDetail[] = await Promise.all(
        currencies.map(async currency => {
          const {originBalance, freeBalance, previousNonce} = await retrieveBalance(currency).catch(
            () => {
              return {
                originBalance: null,
                freeBalance: null,
                previousNonce: 0,
              };
            },
          );
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
    } catch (err) {
      console.log(err);
      dispatch({
        type: constants.FETCH_BALANCES,
        balanceDetails: currencies.map(currency => {
          return {
            ...currency,
            originBalance: null,
            freeBalance: null,
            previousNonce: 0,
          };
        }),
      });
    } finally {
      dispatch(setBalanceLoading(false));
    }
  };

export const clearBalances: ThunkActionCreator<Actions, RootState> = () => async dispatch => {
  dispatch(setBalanceLoading(true));
  dispatch({
    type: constants.FETCH_BALANCES,
    balanceDetails: [],
  });
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
