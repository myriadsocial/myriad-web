import { ArrowLeftIcon, GiftIcon, TrashIcon } from '@heroicons/react/outline';

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import dynamic from 'next/dynamic';

import {
  Paper,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  SvgIcon,
} from '@material-ui/core';

import { Modal } from '../atoms/Modal';
import { useStyles } from './MobilePostCreate.styles';
import { handleFormatCKEditor } from './formatter';

import { PostImport } from 'components/PostImport';
import { SocialAvatar } from 'components/atoms/SocialAvatar';
import useConfirm from 'components/common/Confirm/use-confirm.hook';
import { ExclusiveContent } from 'components/common/Tipping/Tipping.interface';
import { convert } from 'html-to-text';
import { FaChevronDown } from 'react-icons/fa';
import ShowIf from 'src/components/common/show-if.component';
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

type MobilePostImportProps = {
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

export const MobilePostImport: React.FC<MobilePostImportProps> = props => {
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
  const [, setTimelineId] = useState<string[]>([]);
  const [, setExperienceVisibility] = useState<string[]>([]);
  const [, setCommonUser] = useState<string[]>([]);
  const [userExperiences, setUserExperiences] = useState<UserExperience[]>([]);
  const [page, setPage] = useState<number>(1);
  const [imageUrl, setImageUrl] = useState<string[]>([]);
  const [selectedTimeline, setSelectedTimeline] = useState<Experience>();
  const [videoUrl, setVideoUrl] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | SVGElement>(null);
  const [importUrl, setImport] = useState<string | undefined>();

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

  const handleOpenMenu = (event: React.MouseEvent<SVGElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePostUrlChange = (url: string | null) => {
    setImport(url);
    setEditorValue(url);
  };

  const handleErrorImport = () => {
    setImport(undefined);
  };

  const handleshowExclusive = () => {
    setShowExclusive(!showExclusive);
    // getPlateEditorRef(`exclusive-${user.id}`);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExperienceChange = (item: UserExperience) => {
    return () => {
      setSelectedTimeline(item.experience);
    };
  };

  const handleImagePaste = event => {
    if (event.clipboardData.getData('image') != '') {
      event.preventDefault();
    }
  };

  const handleSubmit = async () => {
    onSubmit(importUrl, {
      NSFWTag: post.NSFWTag,
      visibility: post.visibility ?? PostVisibility.PUBLIC,
      selectedTimelineIds: [selectedTimeline?.id],
    });
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
          import
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
          <FaChevronDown
            size={15}
            onClick={handleOpenMenu}
            style={{ position: 'absolute', right: 16, top: 22 }}
          />
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
            {userExperiences.map(item => (
              <MenuItem
                key={item.experience.name}
                onClick={handleExperienceChange(item)}>
                {item.experience.name}
              </MenuItem>
            ))}
          </Menu>
          <PostImport
            value={importUrl}
            onChange={handlePostUrlChange}
            onError={handleErrorImport}
          />
        </Paper>
      </div>

      {/* Select Timeline */}
      {/* Timeline list */}
    </Modal>
  );
};

export default MobilePostImport;
