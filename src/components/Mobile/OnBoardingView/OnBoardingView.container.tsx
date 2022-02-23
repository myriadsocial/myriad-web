import React from 'react';

import {CarouselLoginView} from 'src/components/Mobile/OnBoardingView/CarouselLoginView';
import {MobileLogin} from 'src/components/Mobile/OnBoardingView/MobileLoginView';
import ShowIf from 'src/components/common/show-if.component';
import {useAuthHook} from 'src/hooks/auth.hook';

export const OnBoardingContainer: React.FC = () => {
  const {anonymous} = useAuthHook();

  const [isSignIn, setIsSignIn] = React.useState(false);

  const handleSignIn = () => {
    setIsSignIn(true);
  };
  return (
    <>
      <ShowIf condition={!isSignIn}>
        <CarouselLoginView onSignIn={handleSignIn} />
      </ShowIf>
      <ShowIf condition={isSignIn}>
        <MobileLogin anonymousLogin={anonymous} />
      </ShowIf>
    </>
  );
};

export default OnBoardingContainer;
