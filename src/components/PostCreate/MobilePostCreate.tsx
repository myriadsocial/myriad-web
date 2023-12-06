import { ArrowLeftIcon, GiftIcon, TrashIcon } from '@heroicons/react/outline';
import { LuImagePlus } from "react-icons/lu";
import React, { useEffect, useRef, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import dynamic from 'next/dynamic';
import * as UploadAPI from 'src/lib/api/upload';

import {
  Box,
  Button,
  IconButton,
  Paper,
  SvgIcon,
  Typography,
  Grid,
} from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import { NSFWTags } from '../NSFWTags';
import { PostImport } from '../PostImport';
import { DropdownMenu } from '../atoms/DropdownMenu';
import { Modal } from '../atoms/Modal';
import { TabPanel } from '../atoms/TabPanel';
import { useStyles } from './MobilePostCreate.styles';
import SettingVisibility from './SettingVisibility';
import { menuOptions } from './default';
import { handleFormatCKEditor, handleMention, serialize } from './formatter';

import ExclusiveCreate from 'components/ExclusiveContentCreate/ExclusiveCreate';
import Reveal from 'components/ExclusiveContentCreate/Reveal/Reveal';
import ExperienceListBarCreatePost from 'components/ExperienceList/ExperienceListBarCreatePost';
import { ExperienceTimelinePost } from 'components/ExperienceTimelinePost';
import { PrimaryCoinMenu } from 'components/PrimaryCoinMenu';
import { SocialAvatar } from 'components/atoms/SocialAvatar';
import useConfirm from 'components/common/Confirm/use-confirm.hook';
import { getEditorSelectors } from 'components/common/Editor/store';
import { useEnqueueSnackbar } from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import { ExclusiveContent } from 'components/common/Tipping/Tipping.interface';
import { convert } from 'html-to-text';
import ShowIf from 'src/components/common/show-if.component';
import { useExperienceHook } from 'src/hooks/use-experience-hook';
import { useUpload } from 'src/hooks/use-upload.hook';
import { LogoMyriadCircle } from 'src/images/Icons';
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

type MobilePostCreateProps = {
  user: User;
  open: boolean;
  isMobile?: boolean;
  onClose: () => void;
  onSearchPeople: (query: string) => void;
  onSubmit: (
    post: Partial<Post> | string,
    attributes?: Pick<Post, 'NSFWTag' | 'visibility' | 'selectedTimelineIds'>,
  ) => void;
};

type PostCreateType = 'create' | 'import';

const initialPost = {
  visibility: PostVisibility.PUBLIC,
  isNSFW: false,
};

export const MobilePostCreate: React.FC<MobilePostCreateProps> = props => {
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
  const [currentExperience, setCurrentExperience] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState([]);

  const Editor = CKEditor;

  const uploadFieldRef = useRef<HTMLInputElement | null>(null);

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

  const handleImagePaste = event => {
    if (event.clipboardData.getData('image') != '') {
      event.preventDefault();
    }
  };

  const handleSubmit = async () => {
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
                selectedTimelineIds: post.selectedTimelineIds ?? timelineId,
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
        const rawtext = convert(content.current);
        await handleFormatCKEditor(rawtext)
          .then(output => {
            onSubmit({
              text: JSON.stringify(output.format),
              rawText: rawtext,
              selectedUserIds: post.selectedUserIds,
              NSFWTag: post.NSFWTag,
              visibility: post.visibility ?? PostVisibility.PUBLIC,
              tags: output.hashtags,
              mentions: output.mentions,
              selectedTimelineIds: timelineId ?? ['656e94ae9370a8bd1f64671b'],
            });
          })
          .then(() => handleClose());
        console.log(content.current);
        // onSubmit({
        //   text: content.current,
        //   rawText: content.current,
        //   selectedUserIds: post.selectedUserIds,
        //   NSFWTag: post.NSFWTag,
        //   visibility: post.visibility ?? PostVisibility.PUBLIC,
        //   selectedTimelineIds: timelineId,
        // });
      }
    }

    // handleClose();
  };

  const handleClose = () => {
    setPost(initialPost);
    setImport(undefined);
    setShowExclusive(false);
    setExclusiveContent(null);
    setShowTimelineCreate(false);
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
    saveExperience,
    removeExperience,
    loadExperience,
    unsubscribeExperience,
  } = useExperienceHook();
  const anonymous = useSelector<RootState, boolean>(
    state => state.userState.anonymous,
    shallowEqual,
  );
  const { uploadImage } = useUpload();
  const onImageUpload = async (files: File[]) => {
    const url = await uploadImage(files[0]);

    return url ?? '';
  };
  const onSave = (attributes: ExperienceProps) => {
    saveExperience(attributes);
    fetchUserExperiences();
    setShowTimelineCreate(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      UploadAPI.image(event.target.files[0], {
        onUploadProgress: (event: ProgressEvent) => {
          const fileProgress = Math.round((100 * event.loaded) / event.total);
          setImageUrl([fileProgress])
        },
      });

      if (uploadFieldRef && uploadFieldRef.current) {
        uploadFieldRef.current.value = '';
      }
    }
  };

  const selectFile = (): void => {
    const uploadField: any = uploadFieldRef?.current;

    if (!uploadField) return;

    uploadField.click();
  };

  const fetchUserExperiences = async () => {
    const { meta, data: experiences } = await ExperienceAPI.getUserExperiences(
      user.id,
      'personal',
      page,
    );

    setUserExperiences([...experiences]);

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
      onPaste={handleImagePaste}
      open={open}
      fullScreen={isMobile}
      maxWidth="md"
      className={styles.root}>
      <div>
        <button className={styles.postbutton} onClick={handleSubmit}>
          post
        </button>
      </div>
      <div>
        <Paper className={styles.timelinePaper}>
          <div className={styles.avatar}>
            <SocialAvatar
              avatar={user.profilePictureURL}
              origin="myriad"
              onClick={() => {}}
              name="avatar"
            />
          </div>
          <div className={styles.cardUserName}>
            <Typography>Timeline Name</Typography>
          </div>
        </Paper>
      </div>
      <div className={styles.editor}>
        <Editor
          userId={user.id}
          mobile={isMobile}
          onSearchMention={onSearchPeople}
          onChange={handleContentChange}
          autoFocus={!showExclusive}
        />
        <div className={styles.grid}>
          <Grid container spacing={2}>
            <Grid item xs={3} md={4}>
              <input
                type="file"
                ref={uploadFieldRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept="image/*"
              />
              <IconButton
              onClick={selectFile}
              size={"medium"}
              >
                <LuImagePlus 
                size={12}
                />
              </IconButton>
            </Grid>
          </Grid>
        </div>
        <button className={styles.privacySettingsButton}>
          privacy settings
        </button>
        <div className={styles.privacyPaper}>
          <Paper>
            <div>
              <Typography>Everyone can see this posts</Typography>
            </div>
          </Paper>
        </div>
      </div>

      {/* Select Timeline */}
      {/* Timeline list */}
    </Modal>
  );
};

export default MobilePostCreate;
