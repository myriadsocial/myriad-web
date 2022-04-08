import {BaseError} from './base.error';

export class AccountBannedError extends BaseError {
  constructor(message = 'The wallet account banned.') {
    super(message);
  }
}
