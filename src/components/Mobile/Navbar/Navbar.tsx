import {ChevronLeftIcon} from '@heroicons/react/outline';
import {SearchIcon} from '@heroicons/react/solid';

import React from 'react';

import {SvgIcon, Grid} from '@material-ui/core';

import {MenuDrawerComponent} from 'src/components/Mobile/MenuDrawer/MenuDrawer';
import {useStyles} from 'src/components/Mobile/Navbar/navbar.style';
import {MyriadFullIcon} from 'src/components/atoms/Icons';
import {SearchBoxContainer} from 'src/components/atoms/Search/SearchBoxContainer';
import ShowIf from 'src/components/common/show-if.component';

type SearchBoxContainerProps = {
  onSubmitSearch?: (args: string) => void;
  iconPosition?: 'start' | 'end';
  outlined?: boolean;
};

export const NavbarComponent: React.FC<SearchBoxContainerProps> = ({onSubmitSearch}) => {
  const [isSearch, setIsSearch] = React.useState(false);

  const toggleOpenSearch = () => {
    setIsSearch(!isSearch);
  };
  const style = useStyles();
  return (
    <Grid
      container
      alignItems="center"
      wrap="nowrap"
      justifyContent="space-between"
      className={style.root}>
      <ShowIf condition={!isSearch}>
        <MenuDrawerComponent />
        <MyriadFullIcon width={105} height={25} />
        <SvgIcon
          classes={{root: style.fill}}
          component={SearchIcon}
          viewBox="0 0 20 20"
          style={{width: 25, height: 25}}
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
        <SearchBoxContainer onSubmitSearch={onSubmitSearch} />
      </ShowIf>
    </Grid>
  );
};
