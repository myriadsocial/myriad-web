import {TNode} from '@udecode/plate';

import React, {useState} from 'react';

import {Button} from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import {FriendDetail} from '../FriendsMenu/hooks/use-friend-list.hook';
import {NSFWTags} from '../NSFWTags';
import {PostEditor, formatStringToNode, serialize} from '../PostEditor';
import {PostImport} from '../PostImport';
import {DropdownMenu} from '../atoms/DropdownMenu';
import {Modal} from '../atoms/Modal';
import {TabPanel} from '../atoms/TabPanel';
import {useStyles} from './PostCreate.styles';
import {menuOptions} from './default';

import {Post, PostVisibility} from 'src/interfaces/post';

type PostCreateProps = {
  value?: string;
  url?: string;
  open: boolean;
  people: FriendDetail[];
  onClose: () => void;
  onSubmit: (post: Partial<Post> | string) => void;
  onSearchPeople: (query: string) => void;
  onUploadFile: (file: File, type: 'image' | 'video') => Promise<string>;
};

type PostCreateType = 'create' | 'import';

export const PostCreate: React.FC<PostCreateProps> = props => {
  const {value = '', url, open, people, onClose, onSubmit, onSearchPeople, onUploadFile} = props;
  const styles = useStyles();

  const [activeTab, setActiveTab] = useState<PostCreateType>('create');
  const [post, setPost] = useState<Partial<Post>>({
    visibility: PostVisibility.PUBLIC,
    isNSFW: false,
  });
  const [importUrl, setImport] = useState<string | null>(null);

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

  const handleTabChange = (event: React.ChangeEvent<{}>, tab: PostCreateType) => {
    setActiveTab(tab);
  };

  const handlePostTextChange = (value: TNode[]) => {
    const attributes = serialize(value);

    setPost(prevPost => ({...prevPost, ...attributes}));
  };

  const handlePostUrlChange = (url: string | null) => {
    setImport(url);
  };

  const handleConfirmNSFWTags = (tags: string[]) => {
    setPost(prevPost => ({...prevPost, isNSFW: tags.length > 0, NSFWTag: tags.join(',')}));
  };

  const handleVisibilityChange = (visibility: string) => {
    setPost(prevPost => ({...prevPost, visibility: visibility as PostVisibility}));
  };

  const handleSubmit = () => {
    if (activeTab === 'import' && importUrl) {
      onSubmit(importUrl);
    }
    if (activeTab === 'create') {
      onSubmit(post);
    }
  };

  return (
    <Modal
      title={header[activeTab].title}
      subtitle={header[activeTab].subtitle}
      onClose={onClose}
      open={open}
      maxWidth="md"
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
            avatar: item.avatar,
          }))}
          value={[node]}
          onChange={handlePostTextChange}
          onSearchMention={onSearchPeople}
          onFileUploaded={onUploadFile}
        />
      </TabPanel>

      <TabPanel value={activeTab} index="import">
        <PostImport value={url} onChange={handlePostUrlChange} />
      </TabPanel>

      <div className={styles.action}>
        <div className={styles.option}>
          <DropdownMenu
            title="Visibility"
            options={menuOptions}
            onChange={handleVisibilityChange}
          />

          <NSFWTags tags={post.NSFWTag?.split(',') || []} onConfirm={handleConfirmNSFWTags} />

          <Button color="primary" size="small" className={styles.markdown}>
            Markdown Mode
          </Button>
        </div>

        <Button
          disabled={!importUrl && !post.text}
          variant="contained"
          color="primary"
          size="small"
          onClick={handleSubmit}>
          Create Post
        </Button>
      </div>
    </Modal>
  );
};
