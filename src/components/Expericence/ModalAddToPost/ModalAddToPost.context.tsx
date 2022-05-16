import {createContext} from 'react';

import {ModalAddToPostProps} from './ModalAddToPost.interface';

export type HandleConfirm = (props: ModalAddToPostProps) => void;

export default createContext<HandleConfirm | null>(null);
