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
import i18n from 'src/locale';

type PostCreateProps = {
  url?: string;
  open: boolean;
  people: User[];
  uploadProgress: number;
  isMobile?: boolean;
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
  const {open, people, uploadProgress, isMobile, onClose, onSubmit, onSearchPeople, onUploadFile} =
    props;
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
      title: i18n.t('Post_Create.Title'),
      subtitle: i18n.t('Post_Create.Subtitle'),
    },
    import: {
      title: i18n.t('Post_Import.Title'),
      subtitle: i18n.t('Post_Import.Subtitle'),
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

  const handleErrorImport = () => {
    setValidPost(false);
    setImport(undefined);
  };

  return (
    <Modal
      title={header[activeTab].title}
      subtitle={header[activeTab].subtitle}
      onClose={handleClose}
      open={open}
      fullScreen={isMobile}
      maxWidth="md"
      className={styles.root}>
      <Tabs
        value={activeTab}
        indicatorColor="secondary"
        onChange={handleTabChange}
        className={styles.tabs}>
        <Tab label={i18n.t('Post_Create.Tab_Label')} value="create" />
        <Tab label={i18n.t('Post_Import.Tab_Label')} value="import" />
      </Tabs>

      <TabPanel value={activeTab} index="create">
        <PostEditor
          value={post.text ? deserialize(post as Post) : undefined}
          mentionable={people.map(item => ({
            value: item.id,
            name: item.name,
            username: item.username ?? item.name.replace(' ', ''),
            avatar: item.profilePictureURL,
          }))}
          uploadProgress={uploadProgress}
          onChange={handlePostTextChange}
          onSearchMention={onSearchPeople}
          onFileUploaded={onUploadFile}
          isMobile={isMobile}
        />
      </TabPanel>

      <TabPanel value={activeTab} index="import">
        <PostImport value={importUrl} onChange={handlePostUrlChange} onError={handleErrorImport} />
      </TabPanel>

      <div className={styles.action}>
        <div className={styles.option}>
          <DropdownMenu<PostVisibility>
            title={i18n.t('Post_Create.Visibility.Label')}
            options={menuOptions}
            useIconOnMobile={false}
            onChange={handleVisibilityChange}
          />

          <NSFWTags
            maxWidth={isMobile ? 'xs' : 'md'}
            tags={post.NSFWTag?.split(',') || []}
            onConfirm={handleConfirmNSFWTags}
          />

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
          fullWidth={isMobile}
          onClick={handleSubmit}>
          {i18n.t('Post_Create.Confirm')}
        </Button>
      </div>
    </Modal>
  );
};

export default PostCreate;
