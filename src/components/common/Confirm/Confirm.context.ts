import {createContext} from 'react';

import {ConfirmOptions} from './Confirm.interface';

export type HandleConfirm = (options?: ConfirmOptions) => void;

export default createContext<HandleConfirm | null>(null);
