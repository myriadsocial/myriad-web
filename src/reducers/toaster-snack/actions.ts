import {ToasterSnackProps} from '../../interfaces/toaster-snack';
import {Actions as BaseAction} from '../base/actions';
import * as constants from './constants';

import {VariantType} from 'notistack';
import {Action} from 'redux';

/**
 * Action Types
 */

export interface ShowToasterSnack extends Action {
  type: constants.SHOW_TOASTER_SNACK;
  variant: VariantType;
  message: string;
  key: string | number;
}

export interface CloseToasterSnack extends Action {
  type: constants.CLOSE_TOASTER_SNACK;
  key: string | number;
}

export interface StoreDisplayedToastSnack extends Action {
  type: constants.STORE_DISPLAYED_TOAST_SNACK;
  key: string | number;
}

export interface ClearDisplayedToastSnack extends Action {
  type: constants.CLEAR_DISPLAYED_TOAST_SNACK;
  key: string | number;
}

/**
 * Union Action Types
 */

export type Actions =
  | ShowToasterSnack
  | CloseToasterSnack
  | StoreDisplayedToastSnack
  | ClearDisplayedToastSnack
  | BaseAction;

/**
 *
 * Actions
 */
export const showToasterSnack = (props: ToasterSnackProps): ShowToasterSnack => ({
  type: constants.SHOW_TOASTER_SNACK,
  variant: props.variant,
  message: props.message,
  key: props.key || new Date().getTime() + Math.random(),
});

export const closeToasterSnack = (payload: {key: string | number}): CloseToasterSnack => ({
  type: constants.CLOSE_TOASTER_SNACK,
  key: payload.key,
});

export const storeDisplayedToastSnack = (key: string | number): StoreDisplayedToastSnack => ({
  type: constants.STORE_DISPLAYED_TOAST_SNACK,
  key: key,
});

export const clearDisplayedToastSnack = (key: string | number): ClearDisplayedToastSnack => ({
  type: constants.CLEAR_DISPLAYED_TOAST_SNACK,
  key: key,
});
