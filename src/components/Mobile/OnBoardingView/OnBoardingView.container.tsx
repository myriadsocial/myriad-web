import React, {useState, useEffect} from 'react';

import dynamic from 'next/dynamic';

import {CarouselLoginView} from 'src/components/Mobile/OnBoardingView/CarouselLoginView';
import {useAuthHook} from 'src/hooks/auth.hook';
import {WalletTypeEnum} from 'src/lib/api/ext-auth';

const Login = dynamic(() => import('src/components/Login/Login'), {
  ssr: false,
});

type OnBoardingContainerProps = {
  redirectAuth?: WalletTypeEnum | null;
};

export const OnBoardingContainer: React.FC<OnBoardingContainerProps> = props => {
  const {redirectAuth} = props;

  useEffect(() => {
    if (redirectAuth === WalletTypeEnum.NEAR) {
      setIsMobileSignIn(true);
    }
  }, [redirectAuth]);

  const {anonymous} = useAuthHook();

  const [isMobileSignIn, setIsMobileSignIn] = useState(false);

  const handleMobileSignIn = () => {
    setIsMobileSignIn(true);
  };

  return (
    <>
      {isMobileSignIn ? (
        <Login redirectAuth={redirectAuth} isMobileSignIn={true} />
      ) : (
        <CarouselLoginView onMobileSignIn={handleMobileSignIn} anonymousLogin={anonymous} />
      )}
    </>
  );
};

export default OnBoardingContainer;
