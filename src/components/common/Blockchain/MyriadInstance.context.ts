import {createContext} from 'react';

import {IProvider} from 'src/lib/services/myriad-provider';

export type HandleMyriadInstance = {
  provider: IProvider | null;
  loading: boolean;
  error: boolean;
};

export default createContext<HandleMyriadInstance>({
  provider: null,
  loading: true,
  error: false,
});
