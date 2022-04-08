import {BaseError} from './base.error';

export class AccountRegisteredError extends BaseError {
  constructor(message = 'The wallet account connected with another account.') {
    super(message);
  }
}
