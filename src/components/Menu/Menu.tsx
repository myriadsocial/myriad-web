import React, { useCallback } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';

import Image from 'next/image';
import { useRouter } from 'next/router';

import { Button, SvgIcon } from '@material-ui/core';

import { BoxComponent } from '../atoms/Box';
import { ListItemComponent } from '../atoms/ListItem';
import { useStyles } from './Menu.styles';
import { useMenuList, MenuDetail, MenuId } from './use-menu-list';

import { COOKIE_INSTANCE_URL } from 'components/SelectServer';
import useConfirm from 'components/common/Confirm/use-confirm.hook';
import { useQueryParams } from 'src/hooks/use-query-params.hooks';
import { TimelineType } from 'src/interfaces/timeline';
import i18n from 'src/locale';
import { clearTimeline } from 'src/reducers/timeline/actions';

type MenuProps = {
  selected: MenuId;
  onChange: (path: string) => void;
  logo: string;
  anonymous?: boolean;
};

export const CustomFolderIcon = ({ fill = '#292D32' }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22 11V17C22 21 21 22 17 22H7C3 22 2 21 2 17V7C2 3 3 2 7 2H8.5C10 2 10.33 2.44 10.9 3.2L12.4 5.2C12.78 5.7 13 6 14 6H17C21 6 22 7 22 11Z"
      stroke={fill}
      strokeWidth="1.2"
      strokeMiterlimit="10"
    />
    <path
      d="M15.7399 12.5785V10.6717C15.7399 10.0795 15.4711 9.84009 14.8033 9.84009H13.1065C12.4387 9.84009 12.1699 10.0795 12.1699 10.6717V12.5743C12.1699 13.1707 12.4387 13.4059 13.1065 13.4059H14.8033C15.4711 13.4101 15.7399 13.1707 15.7399 12.5785Z"
      stroke={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.7399 17.3033V15.6065C15.7399 14.9387 15.4711 14.6699 14.8033 14.6699H13.1065C12.4387 14.6699 12.1699 14.9387 12.1699 15.6065V17.3033C12.1699 17.9711 12.4387 18.2399 13.1065 18.2399H14.8033C15.4711 18.2399 15.7399 17.9711 15.7399 17.3033Z"
      stroke={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.9098 12.5785V10.6717C10.9098 10.0795 10.641 9.84009 9.97324 9.84009H8.27644C7.60864 9.84009 7.33984 10.0795 7.33984 10.6717V12.5743C7.33984 13.1707 7.60864 13.4059 8.27644 13.4059H9.97324C10.641 13.4101 10.9098 13.1707 10.9098 12.5785Z"
      stroke={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.9098 17.3033V15.6065C10.9098 14.9387 10.641 14.6699 9.97324 14.6699H8.27644C7.60864 14.6699 7.33984 14.9387 7.33984 15.6065V17.3033C7.33984 17.9711 7.60864 18.2399 8.27644 18.2399H9.97324C10.641 18.2399 10.9098 17.9711 10.9098 17.3033Z"
      stroke={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CustomCreateTimelineIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22 11V17C22 21 21 22 17 22H7C3 22 2 21 2 17V7C2 3 3 2 7 2H8.5C10 2 10.33 2.44 10.9 3.2L12.4 5.2C12.78 5.7 13 6 14 6H17C21 6 22 7 22 11Z"
      stroke="white"
      strokeWidth="1.2"
      strokeMiterlimit="10"
    />
    <path
      d="M16.3992 12.7214V10.9034C16.3992 10.1879 16.1112 9.8999 15.3957 9.8999H13.5777C12.8622 9.8999 12.5742 10.1879 12.5742 10.9034V12.7214C12.5742 13.4369 12.8622 13.7249 13.5777 13.7249H15.3957C16.1112 13.7249 16.3992 13.4369 16.3992 12.7214Z"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.2254 12.8339V10.7909C11.2254 10.1564 10.9374 9.8999 10.2219 9.8999H8.40389C7.68839 9.8999 7.40039 10.1564 7.40039 10.7909V12.8294C7.40039 13.4684 7.68839 13.7204 8.40389 13.7204H10.2219C10.9374 13.7249 11.2254 13.4684 11.2254 12.8339Z"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.2254 17.8965V16.0785C11.2254 15.363 10.9374 15.075 10.2219 15.075H8.40389C7.68839 15.075 7.40039 15.363 7.40039 16.0785V17.8965C7.40039 18.612 7.68839 18.9 8.40389 18.9H10.2219C10.9374 18.9 11.2254 18.612 11.2254 17.8965Z"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M13.0254 16.875H15.7254" stroke="white" strokeLinecap="round" />
    <path d="M14.375 18.2249V15.5249" stroke="white" strokeLinecap="round" />
  </svg>
);

export const CustomSearchIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20 5.75H14C13.59 5.75 13.25 5.41 13.25 5C13.25 4.59 13.59 4.25 14 4.25H20C20.41 4.25 20.75 4.59 20.75 5C20.75 5.41 20.41 5.75 20 5.75Z"
      fill="#6E3FC3"
    />
    <path
      d="M17 8.75H14C13.59 8.75 13.25 8.41 13.25 8C13.25 7.59 13.59 7.25 14 7.25H17C17.41 7.25 17.75 7.59 17.75 8C17.75 8.41 17.41 8.75 17 8.75Z"
      fill="#6E3FC3"
    />
    <path
      d="M11.5 21.75C5.85 21.75 1.25 17.15 1.25 11.5C1.25 5.85 5.85 1.25 11.5 1.25C11.91 1.25 12.25 1.59 12.25 2C12.25 2.41 11.91 2.75 11.5 2.75C6.67 2.75 2.75 6.68 2.75 11.5C2.75 16.32 6.67 20.25 11.5 20.25C16.33 20.25 20.25 16.32 20.25 11.5C20.25 11.09 20.59 10.75 21 10.75C21.41 10.75 21.75 11.09 21.75 11.5C21.75 17.15 17.15 21.75 11.5 21.75Z"
      fill="#6E3FC3"
    />
    <path
      d="M21.9995 22.7499C21.8095 22.7499 21.6195 22.6799 21.4695 22.5299L19.4695 20.5299C19.1795 20.2399 19.1795 19.7599 19.4695 19.4699C19.7595 19.1799 20.2395 19.1799 20.5295 19.4699L22.5295 21.4699C22.8195 21.7599 22.8195 22.2399 22.5295 22.5299C22.3795 22.6799 22.1895 22.7499 21.9995 22.7499Z"
      fill="#6E3FC3"
    />
  </svg>
);

export const Menu: React.FC<MenuProps> = props => {
  const { logo, anonymous } = props;

  const styles = useStyles();
  const router = useRouter();
  const confirm = useConfirm();
  const dispatch = useDispatch();
  const { query, replace } = useQueryParams();

  const menu = useMenuList(
    anonymous ? 'all' : query.type && query.type === 'all' ? 'all' : 'timeline',
  );

  const gotoHome = () => {
    if (router.pathname !== '/') router.push('/', undefined, { shallow: true });
    if (router.query?.type === 'all')
      router.push('/', undefined, { shallow: true });
    return;
  };

  const openMenu = useCallback(
    async (item: MenuDetail) => {
      await dispatch(clearTimeline());

      // automatically select first experience as timeline filter
      if (router.pathname === '/') {
        if (item.url === '/') {
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
        if (item.url === '/') {
          router.push(`/?type=${TimelineType.EXPERIENCE}`);
        } else {
          router.push(`/?type=${TimelineType.ALL}`);
        }
      }
    },
    [query],
  );

  const [cookies] = useCookies([COOKIE_INSTANCE_URL]);

  const handleCreateTimeline = () => {
    if (anonymous) {
      confirm({
        icon: 'createTimeline',
        title: i18n.t('Confirm.Anonymous.CreateTimeline.Title'),
        description: i18n.t('Confirm.Anonymous.CreateTimeline.Desc'),
        confirmationText: i18n.t('General.SignIn'),
        cancellationText: i18n.t('LiteVersion.MaybeLater'),
        onConfirm: () => {
          router.push(`/login?instance=${cookies[COOKIE_INSTANCE_URL]}`);
        },
      });
    } else {
      router.push('/experience/create');
    }
  };

  return (
    <div className={styles.root} data-testid={'menu-test'}>
      <BoxComponent
        paddingLeft={0}
        paddingRight={0}
        style={{
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          marginBottom: '12px',
        }}>
        <div className={styles.head} onClick={gotoHome} aria-hidden="true">
          <Image
            loader={() => logo ?? ''}
            src={logo ?? ''}
            alt=""
            width={220}
            height={48}
          />
        </div>

        {menu
          .filter(ar => ar.isDesktop === true)
          .map(item => {
            if (anonymous && !item.allowAnonymous) return;
            return (
              <ListItemComponent
                data-testid={`list-item-${item.id}`}
                id={item.id}
                key={item.id}
                title={item.title}
                icon={item.icon}
                active={router.pathname === '/' ? item.active : false}
                onClick={async () => openMenu(item)}
                url={item.url}
                isAnimated={item.isAnimated}
              />
            );
          })}

        <div style={{ padding: '0 30px', marginTop: '20px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateTimeline}
            startIcon={<SvgIcon component={CustomCreateTimelineIcon} />}
            style={{
              marginBottom: '10px',
              justifyContent: 'flex-start',
              paddingLeft: '30px',
            }}
            fullWidth>
            {i18n.t('Experience.New.Create')}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => router.push('/experience/discover')}
            startIcon={<SvgIcon component={CustomSearchIcon} />}
            style={{ justifyContent: 'flex-start', paddingLeft: '30px' }}
            fullWidth>
            {i18n.t('Experience.New.Discover')}
          </Button>
        </div>
      </BoxComponent>
    </div>
  );
};
