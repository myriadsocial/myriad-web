import { ChevronLeftIcon } from '@heroicons/react/outline';
import { SearchIcon } from '@heroicons/react/solid';

import React from 'react';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { SvgIcon, Grid } from '@material-ui/core';

import { useStyles } from 'src/components/Mobile/Navbar/navbar.style';
import { SearchBoxContainer } from 'src/components/atoms/Search/SearchBoxContainer';
import ShowIf from 'src/components/common/show-if.component';
import { useInstances } from 'src/hooks/use-instances.hooks';

const MenuDrawerComponent = dynamic(
  () => import('src/components/Mobile/MenuDrawer/MenuDrawer'),
  {
    ssr: false,
  },
);

type SearchBoxContainerProps = {
  iconPosition?: 'start' | 'end';
  outlined?: boolean;
  searched?: boolean;
};

export const NavbarComponent: React.FC<SearchBoxContainerProps> = props => {
  const { searched = false } = props;

  const style = useStyles();
  const router = useRouter();

  const { instance } = useInstances();

  const [isSearch, setIsSearch] = React.useState(searched);

  const toggleOpenSearch = () => {
    if (router.pathname === '/search') {
      router.push('/', undefined, { shallow: true });
    } else {
      setIsSearch(!isSearch);
    }
  };

  const performSearch = (query: string) => {
    const DELAY = 100;
    setTimeout(() => {
      // shallow push, without rerender page
      router.push(
        {
          pathname: 'search',
          query: {
            q: query,
          },
        },
        undefined,
        { shallow: true },
      );
    }, DELAY);
  };

  return (
    <Grid
      container
      alignItems="center"
      wrap="nowrap"
      justifyContent="space-between"
      className={style.root}>
      <ShowIf condition={!isSearch}>
        <MenuDrawerComponent />
        <img
          src={instance?.images?.logo_banner ?? ''}
          width={105}
          height={25}
        />
        <SvgIcon
          classes={{ root: style.fill }}
          component={SearchIcon}
          viewBox="0 0 20 20"
          style={{ width: 25, height: 25 }}
          onClick={toggleOpenSearch}
        />
      </ShowIf>
      {/* Search Components */}
      <ShowIf condition={isSearch}>
        <SvgIcon
          component={ChevronLeftIcon}
          viewBox="0 0 24 24"
          className={style.icon}
          onClick={toggleOpenSearch}
        />
        <SearchBoxContainer onSubmitSearch={performSearch} />
      </ShowIf>
    </Grid>
  );
};
