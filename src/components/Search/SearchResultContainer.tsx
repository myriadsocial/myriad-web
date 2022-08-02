import React, {useState, useEffect, useMemo} from 'react';
import {shallowEqual, useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {SearchExperienceListContainer} from '../ExperienceList';
import {UsersListContainer} from '../UsersList/UsersListContainer';
import {SearchBoxContainer} from '../atoms/Search/SearchBoxContainer';
import {TabsComponent} from '../atoms/Tabs';

import {PostsListContainer} from 'components/PostList';
import {useTimelineFilter} from 'components/PostList/hooks/use-timeline-filter.hook';
import {NavbarComponent} from 'src/components/Mobile/Navbar/Navbar';
import {useExperienceHook} from 'src/hooks/use-experience-hook';
import {useSearchHook} from 'src/hooks/use-search.hooks';
import {User} from 'src/interfaces/user';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    text: {
      position: 'relative',
      fontSize: '14px',
      color: theme.palette.text.secondary,
      alignSelf: 'start',
    },
    box: {
      [theme.breakpoints.down('xs')]: {
        padding: '0px 20px',
      },
    },
  }),
);

export const SearchResultContainer: React.FC = () => {
  const style = useStyles();

  const router = useRouter();

  const {searchExperience, clearExperiences} = useExperienceHook();
  const {searchUsers, clearUsers} = useSearchHook();
  const {clear: clearPosts} = useTimelineFilter();

  const user = useSelector<RootState, User>(state => state.userState.user, shallowEqual);
  const type = router.query.type as string;
  const searchKeyword = router.query.q as string;
  const [selectedTab, setSelectedTab] = useState(type ? 'experience-tab' : 'posts-tab');

  useEffect(() => {
    if (searchKeyword.length) {
      switch (selectedTab) {
        case 'users-tab': {
          searchUsers(searchKeyword);
          break;
        }

        case 'experience-tab': {
          searchExperience(searchKeyword);
          break;
        }

        default: {
          break;
        }
      }
    } else if (selectedTab === 'experience-tab') {
      searchExperience('');
    }
  }, [searchKeyword, selectedTab]);

  const searchResultTabTexts = useMemo(() => {
    return [
      {
        id: 'posts-tab',
        title: i18n.t('Search_Result.Post_Tab'),
        component: <PostsListContainer query={router.query} user={user} />,
      },
      {
        id: 'users-tab',
        title: i18n.t('Search_Result.Users_Tab'),
        component: <UsersListContainer query={searchKeyword} />,
      },
      {
        id: 'experience-tab',
        title: i18n.t('Search_Result.Experience_Tab'),
        component: <SearchExperienceListContainer query={searchKeyword} />,
      },
    ];
  }, [searchKeyword]);

  const handleChangeTab = (currentTab: string) => {
    setSelectedTab(currentTab);
  };

  const onSubmitSearch = (query: string) => {
    clearPosts();
    clearUsers();
    clearExperiences();

    router.push(
      {
        pathname: 'search',
        query: {
          q: query,
        },
      },
      undefined,
      {shallow: true},
    );
  };

  return (
    <>
      <NavbarComponent searched={true} />
      <SearchBoxContainer onSubmitSearch={onSubmitSearch} hidden={true} />
      <div className={style.box}>
        <Typography className={style.text}>
          {i18n.t('Search_Result.Helper_Text')} &quot;
          <Typography variant="inherit" color="primary">
            {searchKeyword}
          </Typography>
          &quot; :
        </Typography>

        <TabsComponent
          id="scrollable-users-list"
          selected={selectedTab}
          tabs={searchResultTabTexts}
          mark="underline"
          position="left"
          size="medium"
          onChangeTab={handleChangeTab}
        />
      </div>
    </>
  );
};
