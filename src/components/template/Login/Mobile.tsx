import React from 'react';

import {CookieConsent} from 'src/components/common/CookieConsent';

type LoginProps = {
  children: React.ReactNode;
};

export const MobileLayout: React.FC<LoginProps> = ({children}) => {
  return (
    <div>
      {children}

      <CookieConsent />
    </div>
  );
};
