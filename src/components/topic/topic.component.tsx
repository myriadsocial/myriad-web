import React, { useState } from 'react';

import DividerComponent from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import { TopicListComponent } from './topic-list.component';

import SearchComponent from 'src/components/common/search.component';

interface TopicProps {}

const TopicComponent: React.FC<TopicProps> = props => {
  const [search, setSearchQuery] = useState('');

  const handleSearchTag = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div style={{ padding: 8 }}>
      <div style={{ paddingTop: 24, paddingBottom: 8 }}>
        <Typography variant="h4" style={{ marginBottom: 8 }}>
          {'Trending Now'}
        </Typography>
      </div>

      <TopicListComponent />

      <DividerComponent />

      <div style={{ paddingTop: 24, paddingBottom: 8 }}>
        <Typography variant="h4" style={{ marginBottom: 8 }}>
          {'Tags To Add'}
        </Typography>
      </div>

      <SearchComponent value={search} placeholder="Search a tag" onSubmit={handleSearchTag} />

      <TopicListComponent add={true} />
    </div>
  );
};

export default TopicComponent;
