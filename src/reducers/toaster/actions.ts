import {ToasterProps} from '../../interfaces/toaster';
import {Status} from '../../interfaces/toaster';
import {Actions as BaseAction} from '../base/actions';
import * as constants from './constants';

import {Action} from 'redux';

/**
 * Action Types
 */

export interface ShowToaster extends Action {
  type: constants.SHOW_TOASTER;
  toasterStatus: Status;
  message: string;
}

export interface CloseToaster extends Action {
  type: constants.CLOSE_TOASTER;
}

/**
 * Union Action Types
 */

export type Actions = ShowToaster | CloseToaster | BaseAction;

/**
 *
 * Actions
 */
export const showToaster = (props: ToasterProps): ShowToaster => ({
  type: constants.SHOW_TOASTER,
  toasterStatus: props.toasterStatus,
  message: props.message,
});

export const closeToaster = (): CloseToaster => ({
  type: constants.CLOSE_TOASTER,
});
