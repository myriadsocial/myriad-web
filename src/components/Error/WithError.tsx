import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {RootState} from 'src/reducers';
import {State as BaseState} from 'src/reducers/base/state';

export type WithErrorProps = {
  enable?: boolean;
};

export function withError<T>(WrappedComponent: React.ComponentType<T & WithErrorProps>) {
  // Try to create a nice displayName for React Dev Tools.
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  // Creating the inner component. The calculated Props type here is the where the magic happens.
  const ComponentWithError: React.FC<T> = props => {
    const {openToasterSnack} = useToasterSnackHook();

    const {error} = useSelector<RootState, BaseState>(state => state.baseState);

    useEffect(() => {
      if (error) {
        openToasterSnack({
          message: error.message,
          variant: 'error',
        });
      }
    }, [error]);

    // props comes afterwards so the can override the default ones.
    return <WrappedComponent {...(props as T)} />;
  };

  ComponentWithError.displayName = `withError(${displayName})`;

  return ComponentWithError;
}
