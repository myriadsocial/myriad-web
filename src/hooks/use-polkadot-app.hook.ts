export const usePolkadotExtension = () => {
  const enablePolkadotExtension = async () => {
    const { web3Enable } = await import('@polkadot/extension-dapp');

    const extensions = await web3Enable(process.env.NEXT_PUBLIC_APP_NAME as string);

    // no extension installed, or the user did not accept the authorization
    // in this case we should inform the use and give a link to the extension
    return extensions.length > 0;
  };

  const getPolkadotAccounts = async () => {
    const { web3Accounts } = await import('@polkadot/extension-dapp');

    const prefix = process.env.NEXT_PUBLIC_POLKADOT_KEYRING_PREFIX ? Number(process.env.NEXT_PUBLIC_POLKADOT_KEYRING_PREFIX) : 214;
    const allAccounts = await web3Accounts({
      ss58Format: prefix
    });

    return allAccounts;
  };

  const unsubscribeFromAccounts = async () => {
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

  return {
    enablePolkadotExtension,
    getPolkadotAccounts,
    unsubscribeFromAccounts
  };
};
