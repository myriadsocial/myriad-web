import {ELEMENT_PARAGRAPH} from '@udecode/plate-paragraph';

import React from 'react';

import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import {PostEditor} from '../PostEditor';
import {TabPanel} from '../atoms/TabPanel';
import {useStyles} from './PostCreate.styles';

type SocialMediaListProps = {
  value: string;
};

export const PostCreate: React.FC<SocialMediaListProps> = props => {
  const styles = useStyles();

  const [activeTab, setActiveTab] = React.useState(0);

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
        <PostEditor
          mentionable={[]}
          onSearchMention={console.log}
          value={[
            {
              type: ELEMENT_PARAGRAPH,
              children: [
                {
                  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tristique eget quam a auctor. Etiam eu tincidunt massa. Nam tincidunt dignissim varius. Cras suscipit suscipit dolor in hendrerit. In quis aliquam dolor, eget porta purus.',
                },
              ],
            },
          ]}
        />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        Link
      </TabPanel>
    </Paper>
  );
};
