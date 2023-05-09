import { ArrowLeftIcon, GiftIcon, TrashIcon } from '@heroicons/react/outline';

import React, { useEffect, useRef, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import dynamic from 'next/dynamic';

import { Button, IconButton, SvgIcon, Typography } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import { NSFWTags } from '../NSFWTags';
import { PostImport } from '../PostImport';
import { DropdownMenu } from '../atoms/DropdownMenu';
import { Modal } from '../atoms/Modal';
import { TabPanel } from '../atoms/TabPanel';
import { useStyles } from './PostCreate.styles';
import SettingVisibility from './SettingVisibility';
import { menuOptions } from './default';
import { serialize } from './formatter';

import ExclusiveCreate from 'components/ExclusiveContentCreate/ExclusiveCreate';
import Reveal from 'components/ExclusiveContentCreate/Reveal/Reveal';
import ExperienceListBarCreatePost from 'components/ExperienceList/ExperienceListBarCreatePost';
import { useExperienceList } from 'components/ExperienceList/hooks/use-experience-list.hook';
import { ExperienceTimelinePost } from 'components/ExperienceTimelinePost';
import useConfirm from 'components/common/Confirm/use-confirm.hook';
import { getEditorSelectors } from 'components/common/Editor/store';
import { useEnqueueSnackbar } from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import { ExclusiveContent } from 'components/common/Tipping/Tipping.interface';
import { debounce } from 'lodash';
import ShowIf from 'src/components/common/show-if.component';
import { ExperienceOwner } from 'src/hooks/use-experience-hook';
import { useExperienceHook } from 'src/hooks/use-experience-hook';
import { useSearchHook } from 'src/hooks/use-search.hooks';
import { useUpload } from 'src/hooks/use-upload.hook';
import { InfoIconYellow } from 'src/images/Icons';
import { ExclusiveContentPost } from 'src/interfaces/exclusive';
import {
  ExperienceProps,
  UserExperience,
  WrappedExperience,
} from 'src/interfaces/experience';
import { Post, PostVisibility } from 'src/interfaces/post';
import { TimelineType } from 'src/interfaces/timeline';
import { User } from 'src/interfaces/user';
import * as ExperienceAPI from 'src/lib/api/experience';
import i18n from 'src/locale';
import { RootState } from 'src/reducers';
import { createExclusiveContent } from 'src/reducers/timeline/actions';

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
  const { open, user, isMobile, onClose, onSubmit, onSearchPeople } = props;
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const styles = useStyles();
  const enqueueSnackbar = useEnqueueSnackbar();

  const [activeTab, setActiveTab] = useState<PostCreateType>('create');
  const [post, setPost] = useState<Partial<Post>>(initialPost);
  const [editorValue, setEditorValue] = useState<string>('');
  const content = useRef('');

  const [importUrl, setImport] = useState<string | undefined>();
  const [exclusiveContent, setExclusiveContent] =
    useState<ExclusiveContentPost | null>(null);
  const [showExclusive, setShowExclusive] = useState<boolean>(false);
  const [showTimelineCreate, setShowTimelineCreate] = useState<boolean>(false);
  const [timelineId, setTimelineId] = useState<string[]>([]);
  const [experiencesVisibility, setExperienceVisibility] = useState<string[]>(
    [],
  );
  const [commonUser, setCommonUser] = useState<string[]>([]);
  const [userExperiences, setUserExperiences] = useState<UserExperience[]>([]);
  const [page, setPage] = useState<number>(1);

  const Editor = isMobile ? CKEditor : PlateEditor;

  const header: Record<PostCreateType, { title: string; subtitle: string }> = {
    create: {
      title: i18n.t('Post_Create.Title'),
      subtitle: i18n.t('Post_Create.Subtitle'),
    },
    import: {
      title: i18n.t('Post_Import.Title'),
      subtitle: i18n.t('Post_Import.Subtitle'),
    },
  };
  const handleTabChange = (
    event: React.ChangeEvent<{}>,
    tab: PostCreateType,
  ) => {
    setActiveTab(tab);
  };

  const handlePostUrlChange = (url: string | null) => {
    setImport(url);
    setEditorValue(url);
  };

  const handleConfirmNSFWTags = (tags: string[]) => {
    setPost(prevPost => ({
      ...prevPost,
      isNSFW: tags.length > 0,
      NSFWTag: tags.join(','),
    }));
  };

  const handleVisibilityChange = (visibility: PostVisibility) => {
    setPost(prevPost => ({ ...prevPost, visibility }));
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

      if (!attributes.rawText && !value[0].children[0].text) {
        enqueueSnackbar({
          message: i18n.t('Post_Create.Error.Empty'),
          variant: 'warning',
        });
      } else if (exclusiveContent) {
        dispatch(
          createExclusiveContent(
            exclusiveContent,
            [],
            (resp: ExclusiveContent) => {
              const data = {
                ...attributes,
                asset: {
                  exclusiveContents: [resp?.id],
                },
                selectedUserIds: post.selectedUserIds,
                NSFWTag: post.NSFWTag,
                visibility: post.visibility ?? PostVisibility.PUBLIC,
                selectedTimelineIds: post.selectedTimelineIds,
              };

              if (resp?.id) {
                Object.assign(data, {
                  asset: { exclusiveContents: [resp.id] },
                });
              }

              onSubmit(data);
            },
            () => {
              confirm({
                title: i18n.t('LiteVersion.LimitTitlePost', { count: 0 }),
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
          selectedTimelineIds: timelineId,
        });
      }
    }

    if (isMobile && activeTab === 'create') {
      if (exclusiveContent) {
        dispatch(
          createExclusiveContent(
            exclusiveContent,
            [],
            (resp: ExclusiveContent) => {
              const data = {
                text: content.current,
                rawText: content.current,
                selectedUserIds: post.selectedUserIds,
                NSFWTag: post.NSFWTag,
                visibility: post.visibility ?? PostVisibility.PUBLIC,
                selectedTimelineIds: post.selectedTimelineIds,
              };

              if (resp?.id) {
                Object.assign(data, {
                  asset: { exclusiveContents: [resp.id] },
                });
              }

              onSubmit(data);
            },
            () => {
              confirm({
                title: i18n.t('LiteVersion.LimitTitlePost', { count: 0 }),
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
          selectedTimelineIds: post.selectedTimelineIds,
        });
      }
    }

    handleClose();
  };

  const handleClose = () => {
    setPost(initialPost);
    setImport(undefined);
    setShowExclusive(false);
    setExclusiveContent(null);
    setEditorValue('');
    setTimelineId([]);
    setExperienceVisibility([]);
    setCommonUser([]);
    onClose();
  };

  const handleContentChange = data => {
    if (!isMobile) {
      if (data[0].children[0].text !== '' || data[0].children.length > 1) {
        setEditorValue('not empty');
      }
    }
    if (data.length > 0 && isMobile) {
      setEditorValue(data);
    }
    content.current = data;
  };

  const handleErrorImport = () => {
    setImport(undefined);
  };

  const handleshowExclusive = () => {
    setShowExclusive(!showExclusive);
    // getPlateEditorRef(`exclusive-${user.id}`);
  };

  const handleRemoveExclusiveContent = () => {
    setExclusiveContent(null);
  };

  const handleSubmitExclusiveContent = (content: ExclusiveContentPost) => {
    setExclusiveContent(content);
    handleshowExclusive();
  };

  const handleTitleModal: () => { title: string; subtitle: string } = () => {
    const title = !showExclusive
      ? header[activeTab].title
      : i18n.t('ExclusiveContent.Add');
    const subtitle = !showExclusive ? header[activeTab].subtitle : '';

    return {
      title,
      subtitle,
    };
  };
  const {
    selectedExperience,
    tags,
    people,
    searchTags,
    searchPeople,
    saveExperience,
    removeExperience,
    loadExperience,
    unsubscribeExperience,
  } = useExperienceHook();
  const anonymous = useSelector<RootState, boolean>(
    state => state.userState.anonymous,
    shallowEqual,
  );
  const { list: experiences } = useExperienceList(ExperienceOwner.PERSONAL);
  const { searchUsers, users } = useSearchHook();
  const { uploadImage } = useUpload();
  const onImageUpload = async (files: File[]) => {
    const url = await uploadImage(files[0]);

    return url ?? '';
  };
  const handleSearchTags = debounce((query: string) => {
    searchTags(query);
  }, 300);

  const handleSearchPeople = debounce((query: string) => {
    searchPeople(query);
  }, 300);

  const handleCloseExperience = () => {
    setShowTimelineCreate(false);
  };
  const handleSearchUser = debounce((query: string) => {
    searchUsers(query);
  }, 300);
  const onSave = (attributes: ExperienceProps) => {
    saveExperience(attributes);
    handleCloseExperience();
  };

  const fetchUserExperiences = async () => {
    const { meta, data: experiences } = await ExperienceAPI.getUserExperiences(
      user.id,
      'personal',
      page,
    );

    setUserExperiences([...userExperiences, ...experiences]);

    if (meta.currentPage < meta.totalPageCount) setPage(page + 1);
  };

  const resetExperiences = () => {
    setPage(1);
    setUserExperiences([]);
  };

  useEffect(() => {
    if (open) fetchUserExperiences();
    else resetExperiences();
  }, [open, page]);

  const handleRemoveExperience = (experienceId: string) => {
    removeExperience(experienceId, () => {
      loadExperience();
    });
  };
  const handleUnsubscribeExperience = (userExperienceId: string) => {
    unsubscribeExperience(userExperienceId);
  };

  const handleViewPostList = (
    type: TimelineType,
    userExperience: WrappedExperience,
  ) => {
    if (timelineId.includes(userExperience.experience.id)) {
      setTimelineId(
        timelineId.filter(id => id !== userExperience.experience.id),
      );
      setExperienceVisibility(
        experiencesVisibility.filter(
          visibility => visibility !== userExperience.experience.visibility,
        ),
      );
      setCommonUser(
        commonUser.filter(user => user !== userExperience.experience.user.name),
      );
    } else {
      setTimelineId([...timelineId, userExperience.experience.id]);
      setExperienceVisibility([
        ...experiencesVisibility,
        userExperience.experience.visibility,
      ]);
      setCommonUser([...commonUser, userExperience.experience.user.name]);
    }
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
        <div style={{ display: showExclusive ? 'none' : 'block' }}>
          <Editor
            userId={user.id}
            mobile={isMobile}
            onSearchMention={onSearchPeople}
            onChange={handleContentChange}
            autoFocus={!showExclusive}
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
        <div style={{ display: showExclusive ? 'block' : 'none' }}>
          <IconButton
            aria-label="exclusive-content"
            onClick={handleshowExclusive}>
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
            autoFocus={showExclusive}
          />
        </div>
      </TabPanel>

      <TabPanel value={activeTab} index="import">
        <PostImport
          value={importUrl}
          onChange={handlePostUrlChange}
          onError={handleErrorImport}
        />
      </TabPanel>
      <div className="flex flex-row">
        <div className={styles.option}>
          <ShowIf condition={!showExclusive && activeTab === 'create'}>
            {!exclusiveContent ? (
              <>
                <IconButton
                  aria-label="exclusive-content"
                  onClick={handleshowExclusive}>
                  <SvgIcon
                    component={GiftIcon}
                    viewBox="0 0 24 24"
                    className={styles.giftIcon}
                  />
                  <Typography
                    component="span"
                    color="primary"
                    variant="body1"
                    style={{ lineHeight: 1.8 }}>
                    {i18n.t('ExclusiveContent.Add')}
                  </Typography>
                </IconButton>
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
                    style={{ color: '#f44336' }}
                  />
                  <Typography
                    component="span"
                    variant="body1"
                    style={{ lineHeight: 1.8, color: '#f44336' }}>
                    {i18n.t('ExclusiveContent.Remove')}
                  </Typography>
                </IconButton>
              </>
            )}
          </ShowIf>
          <NSFWTags
            maxWidth={isMobile ? 'xs' : 'md'}
            tags={post.NSFWTag?.split(',') || []}
            onConfirm={handleConfirmNSFWTags}
          />
        </div>
      </div>
      <div className={styles.timelineVisibility}>
        <Typography
          component="span"
          variant="h5"
          style={{ lineHeight: 1.8, fontWeight: 700 }}>
          Select Timeline to Post
        </Typography>
        <DropdownMenu<PostVisibility>
          title={'Filter Timeline'}
          options={menuOptions}
          useIconOnMobile={false}
          onChange={handleVisibilityChange}
        />
      </div>
      <div className={styles.warningVisibility}>
        <InfoIconYellow />
        <Typography
          component="span"
          variant="body1"
          style={{
            fontWeight: 500,
            marginLeft: '10px',
          }}>
          Your post visibility will be visible to{' '}
          {experiencesVisibility.includes('private')
            ? 'Only Me'
            : experiencesVisibility.includes('selected_user')
            ? 'Custom'
            : experiencesVisibility.includes('friend')
            ? 'Friends'
            : 'Public'}{' '}
        </Typography>
      </div>
      <div className={styles.timelineVisibility}>
        <Typography
          component="span"
          variant="body1"
          style={{ lineHeight: 1.8, fontWeight: 700 }}>
          {timelineId.length} of {experiences.length} Selected Timelines
        </Typography>
        <Button
          disabled={showTimelineCreate}
          variant="contained"
          color="primary"
          size="small"
          fullWidth={isMobile}
          onClick={() => {
            setShowTimelineCreate(true);
          }}>
          Create Timeline
        </Button>
      </div>
      <ShowIf condition={showTimelineCreate}>
        <div className={styles.experienceCreate}>
          <ExperienceTimelinePost
            isEdit={false}
            experience={selectedExperience}
            tags={tags}
            people={people}
            onSearchTags={handleSearchTags}
            onImageUpload={onImageUpload}
            onSearchPeople={handleSearchPeople}
            onSave={onSave}
            onSearchUser={handleSearchUser}
            users={users}
            onCancel={handleCloseExperience}
          />
        </div>
      </ShowIf>
      {/* Select Timeline */}
      {/* Timeline list */}
      <div>
        <ExperienceListBarCreatePost
          onDelete={handleRemoveExperience}
          onUnsubscribe={handleUnsubscribeExperience}
          experiences={userExperiences}
          selectable={true}
          viewPostList={handleViewPostList}
          user={user}
          anonymous={anonymous}
          {...props}
        />
      </div>
      <div className={styles.action}>
        <ShowIf condition={!showExclusive}>
          <ShowIf condition={post.visibility !== 'selected_user'}>
            <Button
              disabled={editorValue === ''}
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
        <ShowIf condition={post.visibility === PostVisibility.CUSTOM}>
          <SettingVisibility setPost={setPost} />
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'flex-end',
            }}>
            <Button
              disabled={editorValue === ''}
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
