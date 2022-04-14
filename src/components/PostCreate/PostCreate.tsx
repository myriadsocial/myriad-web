import {TNode} from '@udecode/plate';

import React, {useEffect, useState} from 'react';

import {Button} from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import {NSFWTags} from '../NSFWTags';
import {PostEditor, serialize, formatToString, hasMedia, deserialize} from '../PostEditor';
import {PostImport} from '../PostImport';
import {DropdownMenu} from '../atoms/DropdownMenu';
import {Modal} from '../atoms/Modal';
import {TabPanel} from '../atoms/TabPanel';
import {useStyles} from './PostCreate.styles';
import {menuOptions} from './default';

import ShowIf from 'src/components/common/show-if.component';
import {Post, PostVisibility} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';

type PostCreateProps = {
  url?: string;
  open: boolean;
  people: User[];
  uploadProgress: number;
  onClose: () => void;
  onSubmit: (
    post: Partial<Post> | string,
    attributes?: Pick<Post, 'NSFWTag' | 'visibility'>,
  ) => void;
  onSearchPeople: (query: string) => void;
  onUploadFile: (file: File, type: 'image' | 'video') => Promise<string | null>;
};

type PostCreateType = 'create' | 'import';

const initialPost = {
  visibility: PostVisibility.PUBLIC,
  isNSFW: false,
};

export const PostCreate: React.FC<PostCreateProps> = props => {
  const {open, people, uploadProgress, onClose, onSubmit, onSearchPeople, onUploadFile} = props;
  const styles = useStyles();

  const [activeTab, setActiveTab] = useState<PostCreateType>('create');
  const [post, setPost] = useState<Partial<Post>>(initialPost);
  const [importUrl, setImport] = useState<string | undefined>();
  const [validPost, setValidPost] = useState(false);

  useEffect(() => {
    return () => {
      setPost(initialPost);
    };
  }, []);

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

  const handleTabChange = (event: React.ChangeEvent<{}>, tab: PostCreateType) => {
    setActiveTab(tab);
  };

  const handlePostTextChange = (value: TNode[]) => {
    const attributes = serialize(value);

    if (hasMedia(value)) {
      setValidPost(true);
    } else {
      const string = value.map(formatToString).join('');
      setValidPost(string.length > 0);
    }

    setPost(prevPost => ({...prevPost, ...attributes}));
  };

  const handlePostUrlChange = (url: string | null) => {
    if (url) {
      setImport(url);

      setValidPost(Boolean(url));
    } else {
      setValidPost(false);
    }
  };

  const handleConfirmNSFWTags = (tags: string[]) => {
    setPost(prevPost => ({...prevPost, isNSFW: tags.length > 0, NSFWTag: tags.join(',')}));
  };

  const handleVisibilityChange = (visibility: PostVisibility) => {
    setPost(prevPost => ({...prevPost, visibility}));
  };

  const handleSubmit = () => {
    if (activeTab === 'import' && importUrl) {
      onSubmit(importUrl, {
        NSFWTag: post.NSFWTag,
        visibility: post.visibility ?? PostVisibility.PUBLIC,
      });
    }

    if (activeTab === 'create') {
      onSubmit(post);
    }

    setPost(initialPost);
    setImport(undefined);
    setValidPost(false);
  };

  const handleClose = () => {
    setPost(initialPost);
    setImport(undefined);
    setValidPost(false);

    onClose();
  };

  return (
    <Modal
      title={header[activeTab].title}
      subtitle={header[activeTab].subtitle}
      onClose={handleClose}
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
          value={post.text ? deserialize(post as Post) : undefined}
          mentionable={people.map(item => ({
            value: item.id,
            name: item.name,
            avatar: item.profilePictureURL,
          }))}
          uploadProgress={uploadProgress}
          onChange={handlePostTextChange}
          onSearchMention={onSearchPeople}
          onFileUploaded={onUploadFile}
        />
      </TabPanel>

      <TabPanel value={activeTab} index="import">
        <PostImport value={importUrl} onChange={handlePostUrlChange} />
      </TabPanel>

      <div className={styles.action}>
        <div className={styles.option}>
          <DropdownMenu<PostVisibility>
            title="Visibility"
            options={menuOptions}
            onChange={handleVisibilityChange}
          />

          <NSFWTags tags={post.NSFWTag?.split(',') || []} onConfirm={handleConfirmNSFWTags} />

          <ShowIf condition={false}>
            <Button color="primary" size="small" className={styles.markdown}>
              Markdown Mode
            </Button>
          </ShowIf>
        </div>

        <Button
          disabled={!validPost}
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

export default PostCreate;
