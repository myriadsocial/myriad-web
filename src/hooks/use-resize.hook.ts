import React, {useEffect, useState} from 'react';

import debounce from 'lodash/debounce';

export const useResize = (elemRef: React.MutableRefObject<HTMLDivElement | null>): number => {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver(
      debounce(entries => {
        for (const entry of entries) {
          setHeight(entry.contentRect.height);
        }
      }, 200),
    );

    if (elemRef?.current) {
      setHeight(elemRef.current.getBoundingClientRect().height);

      observer.observe(elemRef.current);
    }

    return () => {
      if (elemRef?.current) {
        observer.unobserve(elemRef.current);
      }
    };
  }, []);

  return height;
};
