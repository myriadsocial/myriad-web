import React, {useState, useEffect} from 'react';

import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {useExperienceHook} from '../../hooks/use-experience-hook';
import {useMyriadUser} from '../../hooks/use-myriad-users.hooks';
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
  const {searchExperience} = useExperienceHook();

  const {search: searchUsers} = useMyriadUser();

  const {searchPosts} = useTimelineHook();

  const [submittedQuery, setSubmittedQuery] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchQuery = localStorage.getItem('searchQuery');
      setSubmittedQuery(searchQuery ?? '');
    }
  }, []);

  useEffect(() => {
    searchPosts(submittedQuery);
  }, [submittedQuery]);

  const [selectedTab, setSelectedTab] = useState('');

  const style = useStyles();

  useEffect(() => {
    switch (selectedTab) {
      case 'posts-tab': {
        searchPosts(submittedQuery);
        break;
      }

      case 'users-tab': {
        searchUsers(submittedQuery);
        break;
      }

      case 'experience-tab': {
        searchExperience(submittedQuery);
        break;
      }

      default: {
        break;
      }
    }
  }, [selectedTab, submittedQuery]);

  const [searchResultTabTexts] = useState<TabItems<string>[]>([
    {
      id: 'posts-tab',
      title: 'Post',
      component: <PostsListContainer />,
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
    setSubmittedQuery(query);
  };

  return (
    <>
      <SearchBoxContainer onSubmitSearch={onSubmitSearch} />
      <Typography className={style.text}>
        Search result for &quot;{submittedQuery}&quot; :
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
