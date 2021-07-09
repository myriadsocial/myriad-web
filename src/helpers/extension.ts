export const enableExtension = async () => {
  const { web3Enable, web3Accounts } = await import('@polkadot/extension-dapp');

  const extensions = await web3Enable(process.env.NEXT_PUBLIC_APP_NAME as string);
  //console.log('extensions', extensions);
  if (extensions.length === 0) {
    // no extension installed, or the user did not accept the authorization
    // in this case we should inform the use and give a link to the extension
    return;
  }

  // Using proper prefix
  const prefix = process.env.NEXT_PUBLIC_MYRIAD_ADDRESS_PREFIX ? Number(process.env.NEXT_PUBLIC_MYRIAD_ADDRESS_PREFIX) : 214;

  // we are now informed that the user has at least one extension and that we
  // will be able to show and use accounts
  let allAccounts = await web3Accounts({
    ss58Format: prefix
  });
  return allAccounts;
};

export const unsubscribeFromAccounts = async () => {
  const { web3AccountsSubscribe } = await import('@polkadot/extension-dapp');
  let unsubscribe; // this is the function of type `() => void` that should be called to unsubscribe

  //// we subscribe to any account change and log the new list.
  //// note that `web3AccountsSubscribe` returns the function to unsubscribe
  unsubscribe = await web3AccountsSubscribe(injectedAccounts => {
    injectedAccounts.map(accounts => {
      console.log('detail about the unsubscribed accounts: ', accounts);
    });
  });

  //// don't forget to unsubscribe when needed, e.g when unmounting a component
  unsubscribe && unsubscribe();
};
