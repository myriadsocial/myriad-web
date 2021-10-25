import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {Status} from '../atoms/Toaster';

import {useToasterHook} from 'src/hooks/use-toaster.hook';
import {RootState} from 'src/reducers';
import {State as BaseState} from 'src/reducers/base/state';

export type WithErrorProps = {
  enable?: boolean;
};

export function withError<T extends WithErrorProps = WithErrorProps>(
  WrappedComponent: React.ComponentType<T>,
) {
  // Try to create a nice displayName for React Dev Tools.
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  // Creating the inner component. The calculated Props type here is the where the magic happens.
  const ComponentWithError = (props: Omit<T, keyof WithErrorProps>) => {
    const {openToaster} = useToasterHook();

    const {error} = useSelector<RootState, BaseState>(state => state.baseState);

    useEffect(() => {
      if (error) {
        openToaster({
          message: error.message,
          toasterStatus: Status.DANGER,
        });
      }
    }, [error]);

    // props comes afterwards so the can override the default ones.
    return <WrappedComponent {...(props as T)} />;
  };

  ComponentWithError.displayName = `withError(${displayName})`;

  return ComponentWithError;
}
