import {BaseError} from './base.error';

export class AccountRegisteredError extends BaseError {
  get message() {
    return 'The wallet account connected with another account.';
  }
}
