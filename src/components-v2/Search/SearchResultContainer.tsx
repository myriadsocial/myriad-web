import React, {useState} from 'react';

import Typography from '@material-ui/core/Typography';

import {SearchBoxContainer} from '../atoms/Search/SearchBoxContainer';
import {TabsComponent} from '../atoms/Tabs/';

export const SearchResultContainer: React.FC = () => {
  const [searchResultTabTexts] = useState([
    {
      id: 'first-tab',
      title: 'Post',
      component: <p>Posts</p>,
    },
    {
      id: 'second-tab',
      title: 'People',
      component: <p>People</p>,
    },
    {
      id: 'third-tab',
      title: 'Experience',
      component: <p>Experience</p>,
    },
  ]);

  const [submittedQuery, setSubmittedQuery] = useState('');

  const handleChangeTab = () => {
    console.log('changed tab!');
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
        size="medium"
        onChangeTab={handleChangeTab}
      />
    </>
  );
};
