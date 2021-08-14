import {Actions as BaseAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Action} from 'redux';
import {formatNumber} from 'src/helpers/balance';
import {BalanceDetail} from 'src/interfaces/balance';
import {TokenId} from 'src/interfaces/token';
import {Token} from 'src/interfaces/token';
import {connectToBlockchain} from 'src/lib/services/polkadot-js';
import {ThunkActionCreator} from 'src/types/thunk';

/**
 * Action Types
 */

export interface FetchBalances extends Action {
  type: constants.FETCH_BALANCES;
  balanceDetails: BalanceDetail[];
}

/**
 * Union Action Types
 */

export type Actions = FetchBalances | BaseAction;

/**
 * Action Creator
 */

export const fetchBalances: ThunkActionCreator<Actions, RootState> =
  (address: string, availableTokens: Token[]) => async dispatch => {
    dispatch(setLoading(true));
    const tokenBalances = [];

    try {
      for (let i = 0; i < availableTokens.length; i++) {
        const provider = availableTokens[i].rpc_address;
        const api = await connectToBlockchain(provider);

        if (api) {
          switch (availableTokens[i].id) {
            case TokenId.MYRIA: {
              const {data: balance} = await api.query.system.account(address);
              const tempBalance = balance.free as unknown;
              tokenBalances.push({
                freeBalance: formatNumber(tempBalance as number, availableTokens[i].token_decimal),
                tokenSymbol: availableTokens[i].id,
                tokenDecimals: availableTokens[i].token_decimal,
                rpcAddress: provider,
                tokenImage: availableTokens[i].token_image,
              });
              break;
            }

            //TODO: make enum based on rpc_address, collect the api calls and use multiqueries
            case TokenId.ACA: {
              const {data: balance} = await api.query.system.account(address);
              const tempBalance = balance.free as unknown;
              tokenBalances.push({
                freeBalance: formatNumber(tempBalance as number, availableTokens[i].token_decimal),
                tokenSymbol: availableTokens[i].id,
                tokenDecimals: availableTokens[i].token_decimal,
                rpcAddress: provider,
                tokenImage: availableTokens[i].token_image,
              });
              break;
            }

            // should be for tokens of Acala, e.g. AUSD, DOT
            default: {
              const tokenData: any = await api.query.tokens.accounts(address, {
                TOKEN: availableTokens[i].id,
              });
              tokenBalances.push({
                freeBalance: formatNumber(
                  tokenData.free as number,
                  availableTokens[i].token_decimal,
                ),
                tokenSymbol: availableTokens[i].id,
                tokenDecimals: availableTokens[i].token_decimal,
                rpcAddress: provider,
                tokenImage: availableTokens[i].token_image,
              });
            }
          }

          await api.disconnect();
        }
      }
      dispatch({
        type: constants.FETCH_BALANCES,
        balanceDetails: tokenBalances,
      });
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };
