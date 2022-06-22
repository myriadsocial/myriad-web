import {BaseErrorData} from '../interfaces/error-response.interface';

export class BaseError extends Error {
  protected readonly error: BaseErrorData;

  constructor(error: BaseErrorData) {
    super(error.message);
    // Ensure the name of this error is the same as the class name
    this.name = this.constructor.name;

    this.error = error;

    // This clips the constructor invocation from the stack trace.
    // It's not absolutely essential, but it does make the stack trace a little nicer.
    //  @see Node.js reference (bottom)
    Error.captureStackTrace(this, this.constructor);
  }

  getErrorData() {
    return this.error;
  }
}
