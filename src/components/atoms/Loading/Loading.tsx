import React from 'react';
import Lottie from 'react-lottie';

import LoadingAnimation from 'src/lottie/loading.json';

type LoadingProps = {
  width?: number;
  height?: number;
};

export const Loading: React.FC<LoadingProps> = props => {
  const {width = 50, height = 50} = props;

  const lottieLoading = {
    loop: true,
    autoplay: true,
    animationData: LoadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return <Lottie options={lottieLoading} width={width} height={height} />;
};
