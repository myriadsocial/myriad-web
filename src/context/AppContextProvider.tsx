import React, {ComponentProps, ComponentType} from 'react';

import {AlertProvider} from './alert.context';

import {AuthorizationProvider} from 'components/common/Authorization/Authorization.provider';
import {ModalAddToPostProvider} from 'src/components/Expericence/ModalAddToPost/ModalAddToPost.provider';
import {ConfirmProvider} from 'src/components/common/Confirm/Confirm.provider';

/**
 * Order matters
 * check which provider wrap another provider
 */
const providers = [ConfirmProvider, AlertProvider, ModalAddToPostProvider, AuthorizationProvider];

const combineComponents = (...components: ComponentType<any>[]): React.ComponentType => {
  return components.reduce(
    (AccumulatedComponents, CurrentComponent) => {
      return ({children}: ComponentProps<ComponentType<any>>): JSX.Element => {
        return (
          <AccumulatedComponents>
            <CurrentComponent>{children}</CurrentComponent>
          </AccumulatedComponents>
        );
      };
    },
    ({children}) => <>{children}</>,
  );
};

export const AppContextProvider = combineComponents(...providers);
