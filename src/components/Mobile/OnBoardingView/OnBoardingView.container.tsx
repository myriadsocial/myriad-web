import React from 'react';

import {CarouselLoginView} from 'src/components/Mobile/OnBoardingView/CarouselLoginView';
import {MobileLogin} from 'src/components/Mobile/OnBoardingView/MobileLoginView';
import ShowIf from 'src/components/common/show-if.component';
import {useAuthHook} from 'src/hooks/auth.hook';
import {useResize} from 'src/hooks/use-resize.hook';

export const OnBoardingContainer: React.FC = () => {
  const layoutRef = React.useRef<HTMLDivElement>(null);
  const height = useResize(layoutRef);
  const {anonymous} = useAuthHook();

  const [isSignIn, setIsSignIn] = React.useState(false);

  const handleSignIn = () => {
    setIsSignIn(true);
  };
  return (
    <div ref={layoutRef}>
      <ShowIf condition={!isSignIn}>
        <CarouselLoginView onSignIn={handleSignIn} height={height} />
      </ShowIf>
      <ShowIf condition={isSignIn}>
        <MobileLogin height={height} anonymousLogin={anonymous} />
      </ShowIf>
    </div>
  );
};
