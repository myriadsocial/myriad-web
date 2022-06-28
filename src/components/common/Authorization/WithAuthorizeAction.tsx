import React, {useContext} from 'react';

import {AuthorizationContext} from './Authorization.context';

type BaseAction = {
  onClick: (...args: any) => void;
  fallback?: () => void;
};

// just a function that accepts Component as an argument
export function WithAuthorizeAction<T>(WrappedComponent: React.ComponentType<T & BaseAction>) {
  // Try to create a nice displayName for React Dev Tools.
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithBannedAction: React.FC<T & BaseAction> = props => {
    const authorization = useContext(AuthorizationContext);

    const onClick = (...args: any) => {
      if (authorization.authorized) {
        props.onClick(...args);
      } else {
        props.fallback && props.fallback();
        authorization.alert();
      }
    };

    // props comes afterwards so the can override the default ones.
    return <WrappedComponent {...props} onClick={onClick} />;
  };

  ComponentWithBannedAction.displayName = `WithAuthorizeAction(${displayName})`;

  return ComponentWithBannedAction;
}
