import React, {useState, useEffect, useMemo} from 'react';

import {useRouter} from 'next/router';

import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {SearchExperienceListContainer} from '../ExperienceList';
import {PostsListContainer} from '../PostsList/PostsListContainer';
import {useTimelineHook} from '../Timeline/hooks/use-timeline.hook';
import {UsersListContainer} from '../UsersList/UsersListContainer';
import {SearchBoxContainer} from '../atoms/Search/SearchBoxContainer';
import {TabsComponent} from '../atoms/Tabs';

import {NavbarComponent} from 'src/components/Mobile/Navbar/Navbar';
import {useExperienceHook} from 'src/hooks/use-experience-hook';
import {useSearchHook} from 'src/hooks/use-search.hooks';
import i18n from 'src/locale';

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
  const {searchPosts, clearPosts} = useTimelineHook();

  const [selectedTab, setSelectedTab] = useState('posts-tab');
  const searchKeyword = router.query.q as string;

  useEffect(() => {
    if (searchKeyword.length) {
      switch (selectedTab) {
        case 'posts-tab': {
          searchPosts(searchKeyword);
          break;
        }

        case 'users-tab': {
          searchUsers(searchKeyword);
          break;
        }

        case 'experience-tab': {
          searchExperience(searchKeyword);
          break;
        }

        default: {
          searchPosts(searchKeyword);
          break;
        }
      }
    }
  }, [searchKeyword, selectedTab]);

  const searchResultTabTexts = useMemo(() => {
    return [
      {
        id: 'posts-tab',
        title: i18n.t('Search_Result.Post_Tab'),
        component: <PostsListContainer query={searchKeyword} />,
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
      <NavbarComponent onSubmitSearch={onSubmitSearch} searched={true} />
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
