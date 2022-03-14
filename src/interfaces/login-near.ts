// The configuration for SignInOptions
export interface SignInOptions {
  // The ID of the smart contract requesting access
  contractId?: string;
  // And array of contract methods (Leave empty for access to all methods)
  methodNames?: string[];
  // NEAR wallet will redirect to this URL on sign in success
  successUrl?: string;
  // NEAR wallet will redirect to this URL on sign in failure
  failureUrl?: string;
}
