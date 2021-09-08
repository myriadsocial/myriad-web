import React, {useState} from 'react';

import {Button} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import {PostEditor, formatStringToNode} from '../PostEditor';
import {PostImport} from '../PostImport';
import {PostTags} from '../PostTag/PostTags';
import {DropdownMenu} from '../atoms/DropdownMenu';
import {TabPanel} from '../atoms/TabPanel';
import {useStyles} from './PostCreate.styles';
import {tagOptions, menuOptions} from './default';

type SocialMediaListProps = {
  value: string;
};

export const PostCreate: React.FC<SocialMediaListProps> = props => {
  const styles = useStyles();

  const {value} = props;
  const [activeTab, setActiveTab] = useState(0);

  const node = formatStringToNode(value);

  const handleTabChange = (event: React.ChangeEvent<{}>, tab: number) => {
    setActiveTab(tab);
  };

  return (
    <Paper square className={styles.root}>
      <Tabs
        value={activeTab}
        indicatorColor="secondary"
        textColor="primary"
        onChange={handleTabChange}
        className={styles.tabs}>
        <Tab label="Post" />
        <Tab label="Link" />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        <PostEditor mentionable={[]} onSearchMention={console.log} value={[node]} />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <PostImport value="" />
      </TabPanel>

      <div className={styles.option}>
        <PostTags selected={['profanity', 'pornography']} options={tagOptions} />

        <div className={styles.action}>
          <DropdownMenu title="Visibility" options={menuOptions} />

          <Button variant="contained" color="primary" size="small">
            Create Post
          </Button>
        </div>
      </div>
    </Paper>
  );
};
