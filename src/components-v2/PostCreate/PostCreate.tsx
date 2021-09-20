import React, {useState} from 'react';

import {Button} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Popover from '@material-ui/core/Popover';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import {PostEditor, formatStringToNode} from '../PostEditor';
import {PostImport} from '../PostImport';
import {PostTags} from '../PostTag/PostTags';
import {DropdownMenu} from '../atoms/DropdownMenu';
import {Modal} from '../atoms/Modal';
import {TabPanel} from '../atoms/TabPanel';
import {useStyles} from './PostCreate.styles';
import {tagOptions, menuOptions} from './default';

type PostCreateProps = {
  value: string;
  url?: string;
  open: boolean;
  onClose: () => void;
};

type PostCreateType = 'create' | 'import';

export const PostCreate: React.FC<PostCreateProps> = props => {
  const {value, url, open, onClose} = props;
  const styles = useStyles();

  const [activeTab, setActiveTab] = useState<PostCreateType>('create');
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const nswTagOpen = Boolean(anchorEl);
  const header: Record<PostCreateType, {title: string; subtitle: string}> = {
    create: {
      title: 'Create Post',
      subtitle: 'Create your own post',
    },
    import: {
      title: 'Import Post',
      subtitle: 'Import post from another social media',
    },
  };

  const node = formatStringToNode(value);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, tab: PostCreateType) => {
    setActiveTab(tab);
  };

  return (
    <Modal
      title={header[activeTab].title}
      subtitle={header[activeTab].subtitle}
      onClose={onClose}
      open={open}
      maxWidth="lg"
      className={styles.root}>
      <Tabs
        value={activeTab}
        indicatorColor="secondary"
        onChange={handleTabChange}
        className={styles.tabs}>
        <Tab label="Post" value="create" />
        <Tab label="Link" value="import" />
      </Tabs>

      <TabPanel value={activeTab} index="create">
        <PostEditor mentionable={[]} onSearchMention={console.log} value={[node]} />
      </TabPanel>

      <TabPanel value={activeTab} index="import">
        <PostImport value={url || ''} />
      </TabPanel>

      <div className={styles.action}>
        <div className={styles.option}>
          <DropdownMenu title="Visibility" options={menuOptions} />

          <Button size="small" onClick={handleClick} className={styles.nsfw}>
            NSFW
          </Button>

          <Popover
            open={nswTagOpen}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}>
            <PostTags
              selected={['profanity', 'pornography']}
              options={tagOptions}
              onClose={handleClose}
              onConfirm={handleClose}
            />
          </Popover>

          <Button color="primary" size="small">
            Markdown Mode
          </Button>
        </div>

        <Button variant="contained" color="primary" size="small">
          Create Post
        </Button>
      </div>
    </Modal>
  );
};
