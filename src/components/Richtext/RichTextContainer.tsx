import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { Button } from '@material-ui/core';

import { RichTextComponent } from '.';
import { useStyles } from './richtext.style';

import { COOKIE_INSTANCE_URL } from 'components/SelectServer';
import { PromptComponent } from 'src/components/atoms/Prompt/prompt.component';
import { useQueryParams } from 'src/hooks/use-query-params.hooks';
import { TimelineType } from 'src/interfaces/timeline';
import i18n from 'src/locale';
import { RootState } from 'src/reducers';
import { ConfigState } from 'src/reducers/config/reducer';
import { UserState } from 'src/reducers/user/reducer';

const PostCreateContainer = dynamic(
  () => import('../PostCreate/PostCreate.container'),
  {
    ssr: false,
  },
);

export const RichTextContainer: React.FC = () => {
  const router = useRouter();
  const style = useStyles();

  const { query } = useQueryParams();

  const { user, alias, anonymous } = useSelector<RootState, UserState>(
    state => state.userState,
  );
  const { settings } = useSelector<RootState, ConfigState>(
    state => state.configState,
  );
  const [createPostOpened, setCreatePostOpened] = useState(false);
  const [openPromptDrawer, setOpenPromptDrawer] = useState(false);

  const [textPlaceholder, setTextPlaceholder] = useState('');
  const handleOpenCreatePost = () => {
    if (anonymous) {
      setOpenPromptDrawer(true);
    } else {
      setCreatePostOpened(true);
      if (query.createPost) {
        router.replace('/', undefined, { shallow: true });
      }
    }
  };

  const handleCloseCreatePost = () => {
    setCreatePostOpened(false);

    // change to all tab, on create post
    if (query.type && query.type !== TimelineType.ALL) {
      router.push('/', undefined, { shallow: true });
    }
  };

  const handleCancel = () => {
    setOpenPromptDrawer(false);
  };
  //TODO: to be improved
  useEffect(() => {
    setTextPlaceholder(i18n.t('Home.RichText.Placeholder'));
  }, [settings.language]);

  const [cookies] = useCookies([COOKIE_INSTANCE_URL]);

  const handleSignIn = () => {
    router.push(`/login?instance=${cookies[COOKIE_INSTANCE_URL]}`);
  };

  useEffect(() => {
    if (router.pathname === '/' && query.createPost) {
      handleOpenCreatePost();
    }
  }, [router]);

  return (
    <div className={style.box}>
      <RichTextComponent
        userProfilePict={user?.profilePictureURL || ''}
        onOpenCreatePost={handleOpenCreatePost}
        alias={alias}
        name={user?.name}
        placeholder={textPlaceholder}
      />
      <PromptComponent
        icon="createPost"
        title={i18n.t('Confirm.Anonymous.CreatePost.Title')}
        subtitle={i18n.t('Confirm.Anonymous.CreatePost.Desc')}
        open={openPromptDrawer}
        onCancel={handleCancel}>
        <div className={style.wrapperButtonFlex}>
          <Button variant="outlined" color="secondary" onClick={handleCancel}>
            {i18n.t('LiteVersion.MaybeLater')}
          </Button>
          <Button variant="contained" color="primary" onClick={handleSignIn}>
            {i18n.t('General.SignIn')}
          </Button>
        </div>
      </PromptComponent>
      <PostCreateContainer
        open={createPostOpened}
        onClose={handleCloseCreatePost}
      />
    </div>
  );
};
