/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ChevronLeftIcon,
  GlobeAltIcon,
  PencilIcon,
  PlusIcon,
} from '@heroicons/react/outline';
import { SearchIcon } from '@heroicons/react/solid';

import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { SvgIcon, Grid, IconButton, Modal } from '@material-ui/core';

import { CustomFolderIcon } from 'components/Menu';
import { Avatar, AvatarSize } from 'components/atoms/Avatar';
import { SocialAvatar } from 'components/atoms/SocialAvatar';
import { useStyles } from 'src/components/Mobile/Bottombar/bottombar.style';
import { SearchBoxContainer } from 'src/components/atoms/Search/SearchBoxContainer';
import ShowIf from 'src/components/common/show-if.component';
import { useInstances } from 'src/hooks/use-instances.hooks';
import { useQueryParams } from 'src/hooks/use-query-params.hooks';
import { useUserHook } from 'src/hooks/use-user.hook';
import { TimelineType } from 'src/interfaces/timeline';
import { clearTimeline } from 'src/reducers/timeline/actions';

export const CustomMyriadIcon = ({ fill = '#000' }) => (
  <svg
    width="28"
    height="23"
    viewBox="0 0 28 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M28 7.26838C27.9123 6.08878 27.5498 4.94866 26.9435 3.9454C26.3373 2.94215 25.5052 2.10556 24.5185 1.50709C23.5317 0.908615 22.4196 0.566047 21.277 0.508637C20.1344 0.451227 18.9954 0.680682 17.9572 1.17741L17.0686 1.59772L13.9966 3.46419L10.9865 1.64046L10.0359 1.17741C8.99801 0.682174 7.8597 0.453901 6.71805 0.512053C5.57641 0.570206 4.46529 0.913059 3.47946 1.51137C2.49364 2.10969 1.66235 2.94572 1.05648 3.94816C0.450616 4.9506 0.088152 6.08972 0 7.26838V20.7683C0.000623211 21.1015 0.0858785 21.4287 0.24723 21.7171C0.408581 22.0055 0.640365 22.2451 0.919375 22.4117C1.19838 22.5784 1.51483 22.6663 1.83702 22.6667C2.15922 22.667 2.47585 22.5799 2.75523 22.4139L13.9897 15.6675L25.2241 22.4139C25.5035 22.5799 25.8201 22.667 26.1423 22.6667C26.4645 22.6663 26.781 22.5784 27.06 22.4117C27.339 22.2451 27.5708 22.0055 27.7321 21.7171C27.8935 21.4287 27.9787 21.1015 27.9793 20.7683V7.26838H28ZM20.6504 9.21321C20.7149 9.25119 20.7684 9.30612 20.8057 9.37243C20.843 9.43875 20.8626 9.51408 20.8626 9.59078C20.8626 9.66748 20.843 9.74282 20.8057 9.80913C20.7684 9.87545 20.7149 9.93038 20.6504 9.96835L13.9966 13.9649L7.34268 9.96835C7.27825 9.93038 7.22468 9.87545 7.18742 9.80913C7.15015 9.74282 7.13052 9.66748 7.13052 9.59078C7.13052 9.51408 7.15015 9.43875 7.18742 9.37243C7.22468 9.30612 7.27825 9.25119 7.34268 9.21321L13.9966 5.20243L20.6504 9.21321ZM2.05264 21.1458C1.98772 21.1846 1.91408 21.205 1.83911 21.205C1.76415 21.205 1.69051 21.1846 1.62558 21.1458C1.56346 21.1062 1.51236 21.0506 1.47734 20.9844C1.44231 20.9182 1.42456 20.8437 1.42583 20.7683V7.38236C1.53959 5.91061 2.18288 4.5365 3.22862 3.53144C4.27436 2.52639 5.64652 1.96349 7.07405 1.95392C7.89749 1.95624 8.71064 2.14339 9.45732 2.50246L10.3046 2.91565L12.6052 4.34044L6.63321 7.96652C6.35484 8.13357 6.12412 8.37377 5.96444 8.66278C5.80477 8.95178 5.72181 9.2793 5.72398 9.61215C5.72158 9.94493 5.80526 10.2723 5.96633 10.5604C6.12741 10.8485 6.36003 11.0868 6.6401 11.2507L12.5983 14.8126L2.05264 21.1458ZM26.3813 21.1458C26.3164 21.1846 26.2427 21.205 26.1678 21.205C26.0928 21.205 26.0192 21.1846 25.9542 21.1458L15.4086 14.8198L21.3668 11.2578C21.6439 11.0892 21.8736 10.8487 22.0333 10.56C22.1929 10.2714 22.2768 9.94467 22.2768 9.61215C22.2768 9.27964 22.1929 8.9529 22.0333 8.66426C21.8736 8.37563 21.6439 8.13511 21.3668 7.96652L15.3879 4.33331L17.6886 2.90852L18.5427 2.49533C19.3731 2.0982 20.2841 1.91484 21.1979 1.96091C22.1117 2.00697 23.0012 2.2811 23.7903 2.75987C24.5794 3.23864 25.2448 3.90784 25.7296 4.71031C26.2143 5.51277 26.5041 6.42467 26.5742 7.36811V20.7683C26.5741 20.8435 26.5558 20.9174 26.5209 20.9834C26.486 21.0494 26.4356 21.1052 26.3744 21.1458H26.3813Z"
      fill={fill}
    />
  </svg>
);

const MenuDrawerComponent = dynamic(
  () => import('src/components/Mobile/MenuDrawer/MenuDrawer'),
  {
    ssr: false,
  },
);

const PostCreateContainer = dynamic(
  () => import('src/components/PostCreate/PostCreate.container'),
  {
    ssr: false,
  },
);

type SearchBoxContainerProps = {
  iconPosition?: 'start' | 'end';
  outlined?: boolean;
  searched?: boolean;
};

export const BottombarComponent: React.FC<SearchBoxContainerProps> = props => {
  const { searched = false } = props;

  const { query, replace } = useQueryParams();
  const dispatch = useDispatch();

  const style = useStyles();
  const router = useRouter();

  const { user, anonymous } = useUserHook();
  const [popOpen, setPopOpen] = React.useState(false);

  const { instance } = useInstances();

  const [createPostOpened, setCreatePostOpened] = React.useState(false);
  const [actived, setActived] = React.useState<TimelineType>();

  const handleOpenCreatePost = () => {
    setPopOpen(false);
    setCreatePostOpened(true);
  };

  const handleOpenPopover = () => {
    setPopOpen(true);
  };

  const handleClose = event => {
    setPopOpen(false);
  };

  const handleCloseCreatePost = () => {
    setCreatePostOpened(false);
  };

  const openMenu = useCallback(
    async item => {
      await dispatch(clearTimeline());

      // automatically select first experience as timeline filter
      if (router.pathname === '/') {
        if (item === TimelineType.EXPERIENCE) {
          replace({
            path: '/',
            query: {
              type: TimelineType.EXPERIENCE,
            },
          });
        } else {
          replace({
            path: '/',
            query: {
              type: TimelineType.ALL,
            },
          });
        }
      } else {
        if (item === TimelineType.EXPERIENCE) {
          router.push(`/?type=${TimelineType.EXPERIENCE}`);
        } else {
          router.push(`/?type=${TimelineType.ALL}`);
        }
      }
    },
    [query],
  );

  const openProfile = () => {
    if (anonymous) return;
    router.push(`/profile/${user.id}`);
  };

  return (
    <>
      <PostCreateContainer
        open={createPostOpened}
        onClose={handleCloseCreatePost}
      />

      <Grid
        container
        alignItems="center"
        wrap="nowrap"
        justifyContent="space-between"
        className={style.root}>
        <div className={style.button}>
          <MenuDrawerComponent />
        </div>
        <div className={style.button}>
          <IconButton
            onClick={() =>
              !Boolean(user) ? null : openMenu(TimelineType.EXPERIENCE)
            }
            className={
              (router.pathname === '/' && !query.type && !anonymous) ||
              query.type === TimelineType.EXPERIENCE
                ? style.active
                : style.iconbutton
            }>
            <SvgIcon
              component={() =>
                CustomFolderIcon({
                  fill: anonymous
                    ? '#9E9E9E'
                    : (router.pathname === '/' && !query.type) ||
                      query.type === TimelineType.EXPERIENCE
                    ? '#FFF'
                    : '#000',
                })
              }
            />
          </IconButton>
        </div>

        <div className={style.button}>
          <IconButton
            onClick={() => openMenu(TimelineType.ALL)}
            className={
              query.type === TimelineType.ALL ||
              (router.pathname === '/' && !query.type && anonymous)
                ? style.active
                : style.iconbutton
            }>
            <SvgIcon component={GlobeAltIcon} />
          </IconButton>
        </div>
        <div>
          <Avatar
            src={user?.profilePictureURL}
            size={AvatarSize.TINY}
            name={user?.name}
            onClick={openProfile}
          />
        </div>
      </Grid>
      <div className={style.buttonCreate}>
        <IconButton
          onClick={handleOpenPopover}
          className={style.iconbuttonCreate}>
          <SvgIcon className={style.fillButtonCreate} component={PlusIcon} />
        </IconButton>
        <Modal open={popOpen} onClose={handleClose}>
          <IconButton
            onClick={handleOpenCreatePost}
            className={style.popoverbuttonCreate}>
            <SvgIcon
              className={style.fillButtonCreate}
              component={PencilIcon}
            />
          </IconButton>
        </Modal>
      </div>
    </>
  );
};
