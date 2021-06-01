import React, { useState } from 'react';

import DividerComponent from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import LanguageIcon from '@material-ui/icons/Language';

import { TopicListComponent } from './topic-list.component';

import ExpandablePanel from 'src/components/common/panel-expandable.component';
import SearchComponent from 'src/components/common/search.component';

interface TopicProps {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: '1 1 auto',
      marginTop: theme.spacing(1)
    },
    content: {
      padding: theme.spacing(0, 2)
    }
  })
);

const TopicComponent: React.FC<TopicProps> = props => {
  const styles = useStyles();

  const [search, setSearchQuery] = useState('');

  const handleSearchTag = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className={styles.root}>
      <ExpandablePanel expanded={true} title="World Wide" startIcon={<LanguageIcon />}>
        <div className={styles.content}>
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
      </ExpandablePanel>
    </div>
  );
};

export default TopicComponent;
