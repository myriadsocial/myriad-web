import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import dynamic from 'next/dynamic';

import { Paper, Typography } from '@material-ui/core';

import { Modal } from '../atoms/Modal';
import { MobileEmbed } from './MobileEmbed';
import { useStyles } from './MobilePostCreate.styles';
import { handleFormatCKEditor } from './formatter';

import { SocialAvatar } from 'components/atoms/SocialAvatar';
import useConfirm from 'components/common/Confirm/use-confirm.hook';
import { ExclusiveContent } from 'components/common/Tipping/Tipping.interface';
import { convert } from 'html-to-text';
import { ExclusiveContentPost } from 'src/interfaces/exclusive';
import { Experience, UserExperience } from 'src/interfaces/experience';
import { Post, PostVisibility } from 'src/interfaces/post';
import { User } from 'src/interfaces/user';
import * as ExperienceAPI from 'src/lib/api/experience';
import i18n from 'src/locale';
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
  const [post, setPost] = useState<Partial<Post>>(initialPost);
  const [, setEditorValue] = useState<string>('');
  const content = useRef('');
  const [exclusiveContent, setExclusiveContent] =
    useState<ExclusiveContentPost | null>(null);
  const [showExclusive, setShowExclusive] = useState<boolean>(false);
  const [, setShowTimelineCreate] = useState<boolean>(false);
  const [timelineId, setTimelineId] = useState<string[]>([]);
  const [, setExperienceVisibility] = useState<string[]>([]);
  const [, setCommonUser] = useState<string[]>([]);
  const [, setUserExperiences] = useState<UserExperience[]>([]);
  const [page, setPage] = useState<number>(1);
  const [imageUrl, setImageUrl] = useState<string[]>([]);
  const [selectedTimeline, setSelectedTimeline] = useState<Experience>();
  const [videoUrl, setVideoUrl] = useState<string[]>([]);

  const Editor = CKEditor;

  const uploadImageFieldRef = useRef<HTMLInputElement | null>(null);
  const uploadVideoFieldRef = useRef<HTMLInputElement | null>(null);

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

  const handleRemoveImage = (url: string) => {
    const images = imageUrl;
    console.log(images);
    const index = images.indexOf(url);
    if (index > -1) {
      images.splice(index, 1);
      console.log(images);
      setImageUrl(images);
    }
  };

  const handleImagePaste = event => {
    if (event.clipboardData.getData('image') != '') {
      event.preventDefault();
    }
  };

  const handleSubmit = async () => {
    if (isMobile) {
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
        const rawtext = convert(content.current); // convert ck editor html value into raw text
        await handleFormatCKEditor(rawtext, imageUrl, videoUrl)
          .then(output => {
            onSubmit({
              text: JSON.stringify([output.format]),
              rawText: rawtext,
              selectedUserIds: post.selectedUserIds,
              NSFWTag: post.NSFWTag,
              visibility: post.visibility ?? PostVisibility.PUBLIC,
              tags: output.hashtags,
              mentions: output.mentions,
              selectedTimelineIds: [selectedTimeline?.id],
            });
          })
          .then(() => handleClose());
      }
    }
  };

  const handleClose = () => {
    setImageUrl([]);
    setVideoUrl([]);
    setPost(initialPost);
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

  const handleTitleModal: () => { title: string; subtitle: string } = () => {
    const title = !showExclusive
      ? header['create'].title
      : i18n.t('ExclusiveContent.Add');
    const subtitle = !showExclusive ? header['create'].subtitle : '';

    return {
      title,
      subtitle,
    };
  };

  const fetchUserExperiences = async () => {
    const { meta, data: experiences } = await ExperienceAPI.getUserExperiences(
      user.id,
      'personal',
      page,
    );

    setUserExperiences([...experiences]);
    if (experiences.length !== 0)
      setSelectedTimeline(experiences[0].experience);

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
              avatar={user ? user.profilePictureURL : ''}
              origin="myriad"
              onClick={() => {
                console.log;
              }}
              name="avatar"
            />
          </div>
          {selectedTimeline && (
            <div className={styles.cardUserName}>
              <Typography>{selectedTimeline.name}</Typography>
            </div>
          )}
        </Paper>
      </div>
      <div className={styles.editor}>
        <Editor
          userId={user ? user.id : ''}
          mobile={isMobile}
          onSearchMention={onSearchPeople}
          onChange={handleContentChange}
          autoFocus={!showExclusive}
        />
        <div className={styles.grid}>
          <MobileEmbed
            imageUrl={imageUrl}
            videoUrl={videoUrl}
            onImage={setImageUrl}
            onVideo={setVideoUrl}
            uploadImageFieldRef={uploadImageFieldRef}
            uploadVideoFieldRef={uploadVideoFieldRef}
            onRemove={handleRemoveImage}></MobileEmbed>
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
