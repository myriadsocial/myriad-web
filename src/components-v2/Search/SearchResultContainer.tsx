import React, {useState, useEffect} from 'react';

import {useRouter} from 'next/router';

import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {useExperienceHook} from '../../hooks/use-experience-hook';
import {useSearchHook} from '../../hooks/use-search.hooks';
import {SearchedExperienceListContainer} from '../ExperienceList/SearchedExperienceListContainer';
import {PostsListContainer} from '../PostsList/PostsListContainer';
import {useTimelineHook} from '../Timeline/hooks/use-timeline.hook';
import {UsersListContainer} from '../UsersList/UsersListContainer';
import {SearchBoxContainer} from '../atoms/Search/SearchBoxContainer';
import {TabItems} from '../atoms/Tabs/';
import {TabsComponent} from '../atoms/Tabs/';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    text: {
      position: 'relative',
      fontSize: '14px',
      color: theme.palette.text.secondary,
      alignSelf: 'start',
    },
  }),
);

export const SearchResultContainer: React.FC = () => {
  const style = useStyles();

  const router = useRouter();

  const {searchExperience} = useExperienceHook();
  const {searchUsers} = useSearchHook();
  const {searchPosts} = useTimelineHook();

  const [selectedTab, setSelectedTab] = useState('');
  const searchKeyword = router.query.q as string;

  useEffect(() => {
    if (searchKeyword.length) {
      searchPosts(searchKeyword);
    }
  }, [searchKeyword]);

  useEffect(() => {
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
        break;
      }
    }
  }, [selectedTab]);

  const [searchResultTabTexts] = useState<TabItems<string>[]>([
    {
      id: 'posts-tab',
      title: 'Post',
      component: <PostsListContainer query={searchKeyword} />,
    },
    {
      id: 'users-tab',
      title: 'Users',
      component: <UsersListContainer />,
    },
    {
      id: 'experience-tab',
      title: 'Experience',
      component: <SearchedExperienceListContainer />,
    },
  ]);

  const handleChangeTab = (currentTab: string) => {
    setSelectedTab(currentTab);
  };

  const onSubmitSearch = (query: string) => {
    router.push(
      {
        pathname: 'searchresults',
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
      <SearchBoxContainer onSubmitSearch={onSubmitSearch} />
      <Typography className={style.text}>
        Search result for &quot;{searchKeyword}&quot; :
      </Typography>
      <TabsComponent
        active={searchResultTabTexts[0].id}
        tabs={searchResultTabTexts}
        mark="underline"
        position="left"
        size="medium"
        padding={3.75}
        background="white"
        borderRadius={10}
        paddingLeft={selectedTab === 'users-tab' ? 0 : 30}
        paddingRight={selectedTab === 'users-tab' ? 0 : 30}
        onChangeTab={handleChangeTab}
      />
    </>
  );
};
