import getConfig from 'next/config';

const {publicRuntimeConfig} = getConfig();

export const usePolkadotExtension = () => {
  const enablePolkadotExtension = async () => {
    const {web3Enable} = await import('@polkadot/extension-dapp');

    const extensions = await web3Enable(publicRuntimeConfig.appName);

    // no extension installed, or the user did not accept the authorization
    // in this case we should inform the use and give a link to the extension
    return extensions.length > 0;
  };

  const getPolkadotAccounts = async () => {
    const {web3Accounts} = await import('@polkadot/extension-dapp');

    const allAccounts = await web3Accounts();

    return allAccounts;
  };

  const unsubscribeFromAccounts = async () => {
    const {web3AccountsSubscribe} = await import('@polkadot/extension-dapp');

    const extensionEnabled = await enablePolkadotExtension();

    if (extensionEnabled) {
      //// we subscribe to any account change and log the new list.
      //// note that `web3AccountsSubscribe` returns the function to unsubscribe
      const unsubscribe = await web3AccountsSubscribe(injectedAccounts => {
        injectedAccounts.map(accounts => {
          console.log('detail about the unsubscribed accounts: ', accounts);
        });
      });

      //// don't forget to unsubscribe when needed, e.g when unmounting a component
      unsubscribe && unsubscribe();
    } else {
      return;
    }
  };

  return {
    enablePolkadotExtension,
    getPolkadotAccounts,
    unsubscribeFromAccounts,
  };
};
