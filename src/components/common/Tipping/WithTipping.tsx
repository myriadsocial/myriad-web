import React from 'react';
import {useSelector} from 'react-redux';

import {HandleSendTip} from './Tipping.context';
import {TippingProvider} from './Tipping.provider';

import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';
import {UserState} from 'src/reducers/user/reducer';

export type WithTippingProps = {
  sendTip: HandleSendTip;
};

export function withTipping<T extends WithTippingProps>(WrappedComponent: React.ComponentType<T>) {
  // Try to create a nice displayName for React Dev Tools.
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  // Creating the inner component. The calculated Props type here is the where the magic happens.
  const ComponentWithTipping = (props: Omit<T, keyof WithTippingProps>) => {
    const {user, anonymous} = useSelector<RootState, UserState>(state => state.userState);
    const {balanceDetails} = useSelector<RootState, BalanceState>(state => state.balanceState);

    // props comes afterwards so the can override the default ones.
    return (
      <TippingProvider anonymous={anonymous} sender={user} balances={balanceDetails}>
        <WrappedComponent {...(props as T)} />
      </TippingProvider>
    );
  };

  ComponentWithTipping.displayName = `withTipping(${displayName})`;

  return ComponentWithTipping;
}
