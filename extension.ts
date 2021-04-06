export const enableExtension = async () => {
  const { web3Enable } = await import('@polkadot/extension-dapp');
  web3Enable('localhost');
};
