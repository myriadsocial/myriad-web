import {Actions as BaseAction} from '../base/actions';
import * as constants from './constants';

import {Action} from 'redux';
import {BalanceDetail} from 'src/interfaces/balance';

/**
 * Action Types
 */

export interface InitBalance extends Action {
  type: constants.INIT_BALANCE;
  balanceDetails: BalanceDetail[];
}

/**
 * Union Action Types
 */

export type Actions = InitBalance | BaseAction;
