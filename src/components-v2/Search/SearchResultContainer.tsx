import React, {useState, useEffect} from 'react';

import Typography from '@material-ui/core/Typography';

import {useExperienceHook} from '../../hooks/use-experience-hook';
import {SearchedExperienceListContainer} from '../ExperienceList/SearchedExperienceListContainer';
import {TimelineContainer} from '../Timeline/';
import {SearchBoxContainer} from '../atoms/Search/SearchBoxContainer';
import {TabItems} from '../atoms/Tabs/';
import {TabsComponent} from '../atoms/Tabs/';

export const SearchResultContainer: React.FC = () => {
  const {searchExperience, searchPeople} = useExperienceHook();

  const [submittedQuery, setSubmittedQuery] = useState('');

  const [selectedTab, setSelectedTab] = useState('');

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
      component: <TimelineContainer />,
    },
    {
      id: 'people-tab',
      title: 'People',
      component: <p>People</p>,
    },
    {
      id: 'experience-tab',
      title: 'Experience',
      component: <SearchedExperienceListContainer />,
    },
  ]);

  const handleChangeTab = (currentTab: string) => {
    console.log('changed tab!');
    setSelectedTab(currentTab);
  };

  const onSubmitSearch = (query: string) => {
    setSubmittedQuery(query);
    //do search logic here
  };

  return (
    <>
      <SearchBoxContainer onSubmitSearch={onSubmitSearch} />
      <Typography>Search result for {submittedQuery}</Typography>
      <TabsComponent
        active={searchResultTabTexts[0].id}
        tabs={searchResultTabTexts}
        mark="underline"
        position="left"
        size="medium"
        onChangeTab={handleChangeTab}
      />
    </>
  );
};
