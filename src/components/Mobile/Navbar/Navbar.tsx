import React from 'react';
import { useSelector } from 'react-redux';

import { useRouter } from 'next/router';

import { Grid, IconButton, Badge } from '@material-ui/core';

import { NotificationIcon } from 'components/atoms/Icons';
import { useStyles } from 'src/components/Mobile/Navbar/navbar.style';
import { SearchBoxContainer } from 'src/components/atoms/Search/SearchBoxContainer';
import ShowIf from 'src/components/common/show-if.component';
import { formatCount } from 'src/helpers/number';
import { useUserHook } from 'src/hooks/use-user.hook';
import { RootState } from 'src/reducers';
import { NotificationState } from 'src/reducers/notification/reducer';

type SearchBoxContainerProps = {
  iconPosition?: 'start' | 'end';
  outlined?: boolean;
  searched?: boolean;
};

export const NavbarComponent: React.FC<SearchBoxContainerProps> = props => {
  const { total } = useSelector<RootState, NotificationState>(
    state => state.notificationState,
  );

  const style = useStyles();
  const router = useRouter();

  const { user, alias } = useUserHook();

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

  const handleShowNotification = () => {
    router.push(`/notification`);
  };

  return (
    <Grid
      container
      alignItems="center"
      wrap="nowrap"
      justifyContent="space-between"
      className={style.root}>
      {/* Search Components */}
      <SearchBoxContainer onSubmitSearch={performSearch} />
      <ShowIf condition={Boolean(user?.username)}>
        <div className={style.notification}>
          <IconButton
            aria-label="avatar"
            disabled={!!alias}
            onClick={handleShowNotification}>
            <Badge
              invisible={total === 0}
              badgeContent={formatCount(total)}
              color="error">
              <NotificationIcon width={20} height={20} />
            </Badge>
          </IconButton>
        </div>
      </ShowIf>
    </Grid>
  );
};
