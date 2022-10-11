import React from 'react';

import dynamic from 'next/dynamic';

import {WalletTypeEnum} from 'src/interfaces/wallet';

const Login = dynamic(() => import('src/components/Login/Login'), {
  ssr: false,
});

type OnBoardingContainerProps = {
  redirectAuth?: WalletTypeEnum | null;
};

export const OnBoardingContainer: React.FC<OnBoardingContainerProps> = props => {
  const {redirectAuth} = props;

  return (
    <>
      <Login redirectAuth={redirectAuth} isMobileSignIn={true} />
    </>
  );
};

export default OnBoardingContainer;
