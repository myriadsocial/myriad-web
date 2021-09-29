import {ChevronDownIcon} from '@heroicons/react/outline';

import React, {useState} from 'react';

import {Button, IconButton, SvgIcon} from '@material-ui/core';
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

import {People} from 'src/interfaces/people';

type PostCreateProps = {
  value: string;
  url?: string;
  open: boolean;
  people: People[];
  onClose: () => void;
  onSubmit: () => void;
  onSearchPeople: (query: string) => void;
  onUploadFile: (file: File, type: 'image' | 'video') => Promise<string>;
};

type PostCreateType = 'create' | 'import';

export const PostCreate: React.FC<PostCreateProps> = props => {
  const {value, url, open, people, onClose, onSubmit, onSearchPeople, onUploadFile} = props;
  const styles = useStyles();

  const [activeTab, setActiveTab] = useState<PostCreateType>('create');
  const [openTags, setOpenTags] = useState(false);
  const [nsfwTags, setNsfwTags] = useState<string[]>([]);

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
    setOpenTags(true);
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, tab: PostCreateType) => {
    setActiveTab(tab);
  };

  const handleConfirmTags = (tags: string[]) => {
    setNsfwTags(tags);
    handleCloseTags();
  };

  const handleVisibilityChange = (visibility: string) => {
    // code
  };

  const handleCloseTags = () => {
    setOpenTags(false);
  };

  const getTagsStyle = () => {
    const classes = [styles.nsfw];

    if (nsfwTags.length) {
      classes.push(styles.danger);
    }

    return classes.join(' ');
  };

  const handleChange = () => {
    // code
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
        <Tab label="Create" value="create" />
        <Tab label="Import" value="import" />
      </Tabs>

      <TabPanel value={activeTab} index="create">
        <PostEditor
          mentionable={people.map(item => ({
            value: item.id,
            name: item.name,
            avatar: item.profilePictureURL,
          }))}
          value={[node]}
          onChange={handleChange}
          onSearchMention={onSearchPeople}
          onFileUploaded={onUploadFile}
        />
      </TabPanel>

      <TabPanel value={activeTab} index="import">
        <PostImport value={url || ''} />
      </TabPanel>

      <div className={styles.action}>
        <div className={styles.option}>
          <DropdownMenu
            title="Visibility"
            options={menuOptions}
            onChange={handleVisibilityChange}
          />

          <div>
            <Button size="small" onClick={handleClick} className={getTagsStyle()}>
              NSFW
              <IconButton
                onClick={handleClick}
                color="primary"
                aria-label="expand"
                size="small"
                className={styles.expand}>
                <SvgIcon component={ChevronDownIcon} fontSize="small" color="primary" />
              </IconButton>
            </Button>

            <Modal
              title="NSFW tags"
              align="left"
              titleSize="small"
              open={openTags}
              onClose={handleCloseTags}>
              <PostTags selected={nsfwTags} options={tagOptions} onConfirm={handleConfirmTags} />
            </Modal>
          </div>

          <Button color="primary" size="small" className={styles.markdown}>
            Markdown Mode
          </Button>
        </div>

        <Button variant="contained" color="primary" size="small" onClick={onSubmit}>
          Create Post
        </Button>
      </div>
    </Modal>
  );
};
