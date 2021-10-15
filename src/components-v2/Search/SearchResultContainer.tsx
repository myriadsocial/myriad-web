import React, {useState, useEffect} from 'react';

import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {useExperienceHook} from '../../hooks/use-experience-hook';
import {SearchedExperienceListContainer} from '../ExperienceList/SearchedExperienceListContainer';
import {PeopleListContainer} from '../PeopleList/PeopleListContainer';
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
  const {searchExperience, searchPeople} = useExperienceHook();

  const [submittedQuery, setSubmittedQuery] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchQuery = localStorage.getItem('searchQuery');
      setSubmittedQuery(searchQuery ?? '');
    }
  }, []);

  const [selectedTab, setSelectedTab] = useState('');

  const style = useStyles();

  useEffect(() => {
    switch (selectedTab) {
      case 'people-tab': {
        searchPeople(submittedQuery);
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
      id: 'post-tab',
      title: 'Post',
      component: <p>Posts </p>,
    },
    {
      id: 'people-tab',
      title: 'People',
      component: <PeopleListContainer />,
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
        onChangeTab={handleChangeTab}
      />
    </>
  );
};
