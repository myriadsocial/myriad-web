import {ArrowLeftIcon, GiftIcon, TrashIcon} from '@heroicons/react/outline';

import React, {useState} from 'react';

import {Button, IconButton, SvgIcon, Typography} from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import {NSFWTags} from '../NSFWTags';
import {PostImport} from '../PostImport';
import {DropdownMenu} from '../atoms/DropdownMenu';
import {Modal} from '../atoms/Modal';
import {TabPanel} from '../atoms/TabPanel';
import {useStyles} from './PostCreate.styles';
import SettingVisibility from './SettingVisibility';
import {menuOptions} from './default';
import {serialize} from './formatter';

import ExclusiveCreate from 'components/ExclusiveContentCreate/ExclusiveCreate';
import {Editor} from 'components/common/Editor';
import {getEditorSelectors} from 'components/common/Editor/store';
import ShowIf from 'src/components/common/show-if.component';
import {Post, PostVisibility} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';
import i18n from 'src/locale';

type PostCreateProps = {
  user: User;
  open: boolean;
  isMobile?: boolean;
  onClose: () => void;
  onSearchPeople: (query: string) => void;
  onSubmit: (
    post: Partial<Post> | string,
    attributes?: Pick<Post, 'NSFWTag' | 'visibility'>,
  ) => void;
};

type PostCreateType = 'create' | 'import';

const initialPost = {
  visibility: PostVisibility.PUBLIC,
  isNSFW: false,
};

export const PostCreate: React.FC<PostCreateProps> = props => {
  const {open, user, isMobile, onClose, onSubmit, onSearchPeople} = props;
  const styles = useStyles();

  const [activeTab, setActiveTab] = useState<PostCreateType>('create');
  const [post, setPost] = useState<Partial<Post>>(initialPost);

  const [importUrl, setImport] = useState<string | undefined>();

  const [showExclusive, setShowExclusive] = useState<boolean>(false);
  const [exclusiveContent, setExclusiveContent] = useState<string | Partial<Post>>();

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

  const handlePostUrlChange = (url: string | null) => {
    setImport(url);
  };

  const handleConfirmNSFWTags = (tags: string[]) => {
    setPost(prevPost => ({...prevPost, isNSFW: tags.length > 0, NSFWTag: tags.join(',')}));
  };

  const handleVisibilityChange = (visibility: PostVisibility) => {
    setPost(prevPost => ({...prevPost, visibility}));
  };

  const handleSubmit = () => {
    setShowExclusive(false);

    if (activeTab === 'import' && importUrl) {
      onSubmit(importUrl, {
        NSFWTag: post.NSFWTag,
        visibility: post.visibility ?? PostVisibility.PUBLIC,
      });

      setImport(undefined);
    }

    if (activeTab === 'create') {
      const store = getEditorSelectors(user.id);
      const value = store.value();

      const attributes = serialize(value);

      onSubmit({
        ...attributes,
        selectedUserIds: post.selectedUserIds,
        NSFWTag: post.NSFWTag,
        visibility: post.visibility ?? PostVisibility.PUBLIC,
      });
    }
  };

  const handleClose = () => {
    setPost(initialPost);
    setImport(undefined);
    setShowExclusive(false);

    onClose();
  };

  const handleErrorImport = () => {
    setImport(undefined);
  };

  const handleExclusiveContent = (type: string) => {
    type === 'Add' ? setShowExclusive(!showExclusive) : setExclusiveContent('');
  };

  const handleSubmitExclusiveContent = (content: string | Partial<Post>) => {
    setExclusiveContent(content);
    handleExclusiveContent('Add');
  };

  return (
    <Modal
      title={!showExclusive ? header[activeTab].title : i18n.t('ExclusiveContent.Add')}
      subtitle={!showExclusive ? header[activeTab].subtitle : ''}
      onClose={handleClose}
      open={open}
      fullScreen={isMobile}
      maxWidth="md"
      className={styles.root}>
      <ShowIf condition={!showExclusive}>
        <Tabs
          value={activeTab}
          indicatorColor="secondary"
          onChange={handleTabChange}
          className={styles.tabs}>
          <Tab label={i18n.t('Post_Create.Tab_Label')} value="create" />
          <Tab label={i18n.t('Post_Import.Tab_Label')} value="import" />
        </Tabs>

        <TabPanel value={activeTab} index="create">
          <Editor userId={user.id} mobile={isMobile} onSearchMention={onSearchPeople} />
        </TabPanel>

        <TabPanel value={activeTab} index="import">
          <PostImport
            value={importUrl}
            onChange={handlePostUrlChange}
            onError={handleErrorImport}
          />
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

            <ShowIf condition={!showExclusive}>
              {!exclusiveContent ? (
                <>
                  <IconButton
                    aria-label="exclusive-content"
                    onClick={() => handleExclusiveContent('Add')}>
                    <SvgIcon component={GiftIcon} viewBox="0 0 24 24" className={styles.giftIcon} />
                    <Typography
                      component="span"
                      color="primary"
                      variant="body1"
                      style={{lineHeight: 1.8}}>
                      {i18n.t('ExclusiveContent.Add')}
                    </Typography>
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton
                    aria-label="exclusive-content"
                    onClick={() => handleExclusiveContent('Delete')}>
                    <SvgIcon
                      component={TrashIcon}
                      viewBox="0 0 24 24"
                      className={styles.giftIcon}
                      style={{color: '#f44336'}}
                    />
                    <Typography
                      component="span"
                      variant="body1"
                      style={{lineHeight: 1.8, color: '#f44336'}}>
                      {i18n.t('ExclusiveContent.Remove')}
                    </Typography>
                  </IconButton>
                </>
              )}
            </ShowIf>

            <ShowIf condition={false}>
              <Button color="primary" size="small" className={styles.markdown}>
                Markdown Mode
              </Button>
            </ShowIf>
          </div>
          <ShowIf condition={post.visibility !== 'selected_user'}>
            <Button
              disabled={false}
              variant="contained"
              color="primary"
              size="small"
              fullWidth={isMobile}
              onClick={handleSubmit}>
              {i18n.t('Post_Create.Confirm')}
            </Button>
          </ShowIf>
        </div>
        <ShowIf condition={post.visibility === 'selected_user'}>
          <SettingVisibility setPost={setPost} />
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'flex-end',
            }}>
            <Button
              disabled={false}
              variant="contained"
              color="primary"
              size="small"
              fullWidth={isMobile}
              onClick={handleSubmit}>
              {i18n.t('Post_Create.Confirm')}
            </Button>
          </div>
        </ShowIf>
      </ShowIf>

      <ShowIf condition={showExclusive}>
        <IconButton aria-label="exclusive-content" onClick={() => handleExclusiveContent('Add')}>
          <SvgIcon component={ArrowLeftIcon} viewBox="0 0 24 24" className={styles.arrowLeftIcon} />
        </IconButton>
        <ExclusiveCreate
          user={user}
          onSearchPeople={onSearchPeople}
          isMobile={isMobile}
          onSubmit={handleSubmitExclusiveContent}
        />
      </ShowIf>
    </Modal>
  );
};

export default PostCreate;
