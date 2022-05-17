import {createContext} from 'react';

import {ModalAddPostExperienceProps} from './ModalAddToPost.interface';

export type HandleConfirmAddPostExperience = (props: ModalAddPostExperienceProps) => void;

export default createContext<HandleConfirmAddPostExperience | null>(null);
