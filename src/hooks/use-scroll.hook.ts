import {useEffect, useState} from 'react';

import debounce from 'lodash/debounce';

export const useScroll = () => {
  const [isScroll, setIsScroll] = useState<boolean>(false);
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  useEffect(() => {
    window.addEventListener('scroll', listenToScroll);
    return () => {
      window.removeEventListener('scroll', listenToScroll);
    };
  }, []);

  const listenToScroll = debounce(() => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;

    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    const scrolled = winScroll / height;
    setScrollPosition(scrolled);
    setIsScroll(scrolled > 0);
  }, 200);

  return {
    isScroll,
    scrollPosition,
  };
};
