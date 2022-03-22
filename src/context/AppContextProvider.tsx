import React, {ComponentProps, ComponentType} from 'react';

import {AlertProvider} from './alert.context';

import {ConfirmProvider} from 'src/components/common/Confirm/Confirm.provider';

/**
 * Order matters
 * check which provider wrap another provider
 */
const providers = [ConfirmProvider, AlertProvider];

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
