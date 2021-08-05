import React, {useCallback, useEffect, useRef, useState} from 'react';

import AppBar from '../app-bar/app-bar.component';
import SidebarComponent from '../sidebar/sidebar.component';
import {useStyles} from './layout.style';

import BannerDemo from 'src/components/common/banner-demo.component';
import {NotifProvider} from 'src/context/notif.context';

const HEADER_HEIGHT = 68;
const DEMO_BANNER_HEIGHT = 56;

type DesktopLayoutProps = {
  children: React.ReactNode;
  anonymous: boolean;
};

const DesktopLayoutComponent: React.FC<DesktopLayoutProps> = ({children, anonymous}) => {
  const style = useStyles();

  const ref = useRef<HTMLDivElement | null>(null);
  const [top, setTop] = useState(124);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScroll = useCallback(() => {
    const scroll = ref.current?.getBoundingClientRect().top;

    if (scroll) {
      const scrolled = Math.min(HEADER_HEIGHT, HEADER_HEIGHT - scroll);

      setTop(HEADER_HEIGHT + DEMO_BANNER_HEIGHT - scrolled);
    }
  }, []);

  return (
    <>
      <NotifProvider>
        <AppBar />

        <div style={{marginTop: HEADER_HEIGHT}} ref={ref}>
          <BannerDemo />

          <div className={style.appWrapper}>
            <div className={style.contentWrapper}>{children}</div>

            <div className={style.sidebarWrapper} style={{top}}>
              <SidebarComponent isAnonymous={anonymous} />
            </div>
          </div>
        </div>
      </NotifProvider>
    </>
  );
};

export default DesktopLayoutComponent;
