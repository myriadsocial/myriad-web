import React, {useState} from 'react';

import dynamic from 'next/dynamic';

import {CarouselLoginView} from 'src/components/Mobile/OnBoardingView/CarouselLoginView';
import ShowIf from 'src/components/common/show-if.component';
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

  const {anonymous} = useAuthHook();

  const [isMobileSignIn, setIsMobileSignIn] = useState(false);

  const handleMobileSignIn = () => {
    setIsMobileSignIn(true);
  };

  return (
    <>
      <ShowIf condition={!isMobileSignIn}>
        <CarouselLoginView onMobileSignIn={handleMobileSignIn} anonymousLogin={anonymous} />
      </ShowIf>

      <ShowIf condition={isMobileSignIn}>
        <Login redirectAuth={redirectAuth} isMobileSignIn={true} />
      </ShowIf>
    </>
  );
};

export default OnBoardingContainer;
