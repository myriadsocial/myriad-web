import {useState} from 'react';

export const useModal = () => {
  const [isShown, setIsShown] = useState<boolean>(false);
  const toggle = () => setIsShown(true);

  const hide = () => setIsShown(false);
  return {
    isShown,
    toggle,
    hide,
  };
};
