import {ArrowLeftIcon, GiftIcon, TrashIcon} from '@heroicons/react/outline';

import React, {useRef, useState} from 'react';
import {useDispatch} from 'react-redux';

import getConfig from 'next/config';
import dynamic from 'next/dynamic';

import {Button, IconButton, SvgIcon, Tooltip, Typography} from '@material-ui/core';
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
import Reveal from 'components/ExclusiveContentCreate/Reveal/Reveal';
import useConfirm from 'components/common/Confirm/use-confirm.hook';
import {getEditorSelectors} from 'components/common/Editor/store';
import ShowIf from 'src/components/common/show-if.component';
import {ExclusiveContentPost} from 'src/interfaces/exclusive';
import {Post, PostVisibility} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';
import i18n from 'src/locale';
import {createExclusiveContent} from 'src/reducers/timeline/actions';

const CKEditor = dynamic(() => import('../common/CKEditor/Editor'), {
  ssr: false,
});
const PlateEditor = dynamic(() => import('../common/Editor/Editor'), {
  ssr: false,
});

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
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const {publicRuntimeConfig} = getConfig();
  const styles = useStyles();

  const [activeTab, setActiveTab] = useState<PostCreateType>('create');
  const [post, setPost] = useState<Partial<Post>>(initialPost);
  const [loading, setLoading] = useState<boolean>(false);
  const content = useRef('');

  const [importUrl, setImport] = useState<string | undefined>();
  const [exclusiveContent, setExclusiveContent] = useState<ExclusiveContentPost | null>(null);
  const [showExclusive, setShowExclusive] = useState<boolean>(false);

  const Editor = isMobile ? CKEditor : PlateEditor;

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
    if (activeTab === 'import' && importUrl) {
      onSubmit(importUrl, {
        NSFWTag: post.NSFWTag,
        visibility: post.visibility ?? PostVisibility.PUBLIC,
      });

      setImport(undefined);
    }

    if (!isMobile && activeTab === 'create') {
      const store = getEditorSelectors(user.id);
      const value = store.value();

      const attributes = serialize(value);

      if (exclusiveContent) {
        dispatch(
          createExclusiveContent(
            exclusiveContent,
            [],
            resp => {
              onSubmit({
                ...attributes,
                asset: {
                  exclusiveContents: [
                    `${publicRuntimeConfig.myriadAPIURL}/user/unlockable-contents/${resp?.id}`,
                  ],
                },
                selectedUserIds: post.selectedUserIds,
                NSFWTag: post.NSFWTag,
                visibility: post.visibility ?? PostVisibility.PUBLIC,
              });
            },
            () => {
              confirm({
                title: i18n.t('LiteVersion.LimitTitlePost', {count: 0}),
                description: i18n.t('LiteVersion.LimitDescPost'),
                icon: 'warning',
                confirmationText: i18n.t('General.Got_It'),
                cancellationText: i18n.t('LiteVersion.MaybeLater'),
                onConfirm: () => {
                  undefined;
                },
                onCancel: () => {
                  undefined;
                },
                hideCancel: true,
              });
            },
          ),
        );
        setExclusiveContent(null);
      } else {
        onSubmit({
          ...attributes,
          selectedUserIds: post.selectedUserIds,
          NSFWTag: post.NSFWTag,
          visibility: post.visibility ?? PostVisibility.PUBLIC,
        });
      }
    }

    if (isMobile && activeTab === 'create') {
      if (exclusiveContent) {
        dispatch(
          createExclusiveContent(
            exclusiveContent,
            [],
            resp => {
              onSubmit({
                text: content.current,
                rawText: content.current,
                asset: {
                  exclusiveContents: [
                    `${publicRuntimeConfig.myriadAPIURL}/user/unlockable-contents/${resp?.id}`,
                  ],
                },
                selectedUserIds: post.selectedUserIds,
                NSFWTag: post.NSFWTag,
                visibility: post.visibility ?? PostVisibility.PUBLIC,
              });
            },
            () => {
              confirm({
                title: i18n.t('LiteVersion.LimitTitlePost', {count: 0}),
                description: i18n.t('LiteVersion.LimitDescPost'),
                icon: 'warning',
                confirmationText: i18n.t('General.Got_It'),
                cancellationText: i18n.t('LiteVersion.MaybeLater'),
                onConfirm: () => {
                  undefined;
                },
                onCancel: () => {
                  undefined;
                },
                hideCancel: true,
              });
            },
          ),
        );
        setExclusiveContent(null);
      } else {
        onSubmit({
          text: content.current,
          rawText: content.current,
          selectedUserIds: post.selectedUserIds,
          NSFWTag: post.NSFWTag,
          visibility: post.visibility ?? PostVisibility.PUBLIC,
        });
      }
    }
  };

  const handleClose = () => {
    setPost(initialPost);
    setImport(undefined);
    setShowExclusive(false);
    setExclusiveContent(null);

    onClose();
  };

  const handleContentChange = (data, loading) => {
    setLoading(loading);
    content.current = data;
  };

  const handleErrorImport = () => {
    setImport(undefined);
  };

  const handleshowExclusive = () => {
    setShowExclusive(!showExclusive);
  };

  const handleRemoveExclusiveContent = () => {
    setExclusiveContent(null);
  };

  const handleSubmitExclusiveContent = (content: ExclusiveContentPost) => {
    setExclusiveContent(content);
    handleshowExclusive();
  };

  const handleTitleModal: () => {title: string; subtitle: string} = () => {
    const title = !showExclusive ? header[activeTab].title : i18n.t('ExclusiveContent.Add');
    const subtitle = !showExclusive ? header[activeTab].subtitle : '';

    return {
      title,
      subtitle,
    };
  };

  return (
    <Modal
      title={handleTitleModal().title}
      subtitle={handleTitleModal().subtitle}
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
      </ShowIf>

      <TabPanel value={activeTab} index="create">
        <div style={{display: showExclusive ? 'none' : 'block'}}>
          <Editor
            userId={user.id}
            mobile={isMobile}
            onSearchMention={onSearchPeople}
            onChange={handleContentChange}
          />
          {exclusiveContent && (
            <div className={styles.previewEC}>
              <Typography variant="h5" className={styles.titleEC}>
                {i18n.t('ExclusiveContent.Label.ExclusiveContent')}
              </Typography>
              <Reveal
                content={exclusiveContent}
                customStyle={{
                  maxWidth: '820px',
                  width: '100%',
                  maxHeight: '200px',
                  overflowY: 'scroll',
                }}
              />
            </div>
          )}
        </div>
        <div style={{display: showExclusive ? 'block' : 'none'}}>
          <IconButton aria-label="exclusive-content" onClick={handleshowExclusive}>
            <SvgIcon
              component={ArrowLeftIcon}
              viewBox="0 0 24 24"
              className={styles.arrowLeftIcon}
            />
          </IconButton>
          <ExclusiveCreate
            user={user}
            onSearchPeople={onSearchPeople}
            isMobile={isMobile}
            onSubmit={handleSubmitExclusiveContent}
          />
        </div>
      </TabPanel>

      <TabPanel value={activeTab} index="import">
        <PostImport value={importUrl} onChange={handlePostUrlChange} onError={handleErrorImport} />
      </TabPanel>

      <div className={styles.action}>
        <div className={styles.option}>
          <ShowIf condition={!showExclusive}>
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
          </ShowIf>

          <ShowIf condition={!showExclusive}>
            {!exclusiveContent ? (
              <>
                {user.fullAccess ? (
                  <IconButton aria-label="exclusive-content" onClick={handleshowExclusive}>
                    <SvgIcon component={GiftIcon} viewBox="0 0 24 24" className={styles.giftIcon} />
                    <Typography
                      component="span"
                      color="primary"
                      variant="body1"
                      style={{lineHeight: 1.8}}>
                      {i18n.t('ExclusiveContent.Add')}
                    </Typography>
                  </IconButton>
                ) : (
                  <Tooltip
                    title={<Typography>{i18n.t('ExclusiveContent.Text.Tooltip')}</Typography>}
                    aria-label="exclusive-content">
                    <IconButton aria-label="exclusive-content" onClick={null}>
                      <SvgIcon
                        component={GiftIcon}
                        viewBox="0 0 24 24"
                        className={styles.giftIconGray}
                      />
                      <Typography
                        component="span"
                        color={'#C2C2C2' as never}
                        variant="body1"
                        style={{lineHeight: 1.8}}>
                        {i18n.t('ExclusiveContent.Add')}
                      </Typography>
                    </IconButton>
                  </Tooltip>
                )}
              </>
            ) : (
              <>
                <IconButton
                  aria-label="exclusive-content"
                  onClick={() => handleRemoveExclusiveContent()}>
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
        <ShowIf condition={!showExclusive}>
          <ShowIf condition={post.visibility !== 'selected_user'}>
            <Button
              disabled={loading}
              variant="contained"
              color="primary"
              size="small"
              fullWidth={isMobile}
              onClick={handleSubmit}>
              {i18n.t('Post_Create.Confirm')}
            </Button>
          </ShowIf>
        </ShowIf>
      </div>

      <ShowIf condition={!showExclusive}>
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
    </Modal>
  );
};

export default PostCreate;
