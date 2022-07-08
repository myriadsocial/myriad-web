import {InformationCircleIcon} from '@heroicons/react/outline';

import React, {useCallback, useState} from 'react';
import {useSelector} from 'react-redux';

import {
  Checkbox,
  Typography,
  Tooltip,
  IconButton,
  SvgIcon,
  CardActionArea,
  Grid,
  CardMedia,
  CardContent,
  Button,
} from '@material-ui/core';

import ModalAddToPostContext, {HandleConfirmAddPostExperience} from './ModalAddToPost.context';
import {ModalAddPostExperienceProps} from './ModalAddToPost.interface';
import {useStyles} from './ModalAddToPost.styles';

import {Empty} from 'components/atoms/Empty';
import ShowIf from 'components/common/show-if.component';
import {Loading} from 'src/components/atoms/Loading';
import {Modal} from 'src/components/atoms/Modal';
import {useExperienceHook} from 'src/hooks/use-experience-hook';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const ModalAddToPostProvider: React.ComponentType<ModalAddPostExperienceProps> = ({
  children,
}) => {
  const styles = useStyles();
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {userExperiences, loadExperiencePostList, addPostsToExperience, loading} =
    useExperienceHook();
  const [postId, setPostId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);

  const DEFAULT_IMAGE =
    'https://pbs.twimg.com/profile_images/1407599051579617281/-jHXi6y5_400x400.jpg';

  const toolTipText = i18n.t('Experience.Modal_Add_Post.Tooltip_Text');

  const addPostToExperience = useCallback<HandleConfirmAddPostExperience>(
    props => {
      setOpen(true);
      loadExperiencePostList(props.post.id, postsExperiences => {
        setPostId(props.post.id);
        const tmpSelectedExperience: string[] = [];
        postsExperiences.map(item => {
          if (item.posts && item.posts.length > 0) {
            tmpSelectedExperience.push(item.id);
          }
        });
        setSelectedExperience(tmpSelectedExperience);
      });
    },
    [userExperiences],
  );

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleSelectAllExperience = () => {
    const tmpUserExperience = [...userExperiences].filter(ar => ar.experience.user.id === user?.id);
    let tmpSelectedExperience: string[] = [];
    if (!isSelectAll) {
      tmpUserExperience.map(item => {
        tmpSelectedExperience.push(item.experience.id);
      });
    } else {
      tmpSelectedExperience = [];
    }
    setSelectedExperience(tmpSelectedExperience);
    setIsSelectAll(!isSelectAll);
  };

  const handleSelectExperience = (propsSelectedExperience: string) => {
    const tmpSelectedExperience = [...selectedExperience];
    if (tmpSelectedExperience.filter(ar => ar === propsSelectedExperience).length > 0) {
      const indexRemovedExperience = tmpSelectedExperience.indexOf(propsSelectedExperience);
      tmpSelectedExperience.splice(indexRemovedExperience, 1);
    } else {
      tmpSelectedExperience.push(propsSelectedExperience);
    }
    setSelectedExperience(tmpSelectedExperience);
  };

  const handleConfirm = () => {
    if (postId) {
      addPostsToExperience(postId, selectedExperience, () => {
        setOpen(false);
      });
    }
  };

  return (
    <>
      <ModalAddToPostContext.Provider value={addPostToExperience}>
        {children}
      </ModalAddToPostContext.Provider>
      <Modal
        title={i18n.t('Experience.Modal_Add_Post.Title')}
        subtitle={
          <Typography>
            <Typography>{i18n.t('Experience.Modal_Add_Post.Subtitle_1')}</Typography>
            <Typography>{i18n.t('Experience.Modal_Add_Post.Subtitle_2')}</Typography>
          </Typography>
        }
        open={open}
        onClose={handleClose}>
        <div className={styles.root}>
          <div className={styles.options}>
            <div className={styles.flex}>
              <Typography>{i18n.t('Experience.Modal_Add_Post.Tooltip')}</Typography>
              <Tooltip title={toolTipText} arrow>
                <IconButton aria-label="info" className={styles.info} style={{color: '#404040'}}>
                  <SvgIcon component={InformationCircleIcon} viewBox="0 0 24 24" />
                </IconButton>
              </Tooltip>
            </div>
            <div className={styles.flex}>
              <Checkbox
                checked={isSelectAll}
                color="primary"
                onChange={handleSelectAllExperience}
                inputProps={{'aria-label': 'controlled'}}
                classes={{root: styles.fill}}
              />
              <Typography component="span" color="textPrimary" className={styles.selected}>
                {i18n.t('Experience.Modal_Add_Post.Select_All')}
              </Typography>
            </div>
          </div>
          <div></div>
        </div>

        <div className={styles.experienceList}>
          {loading ? (
            <Loading />
          ) : (
            userExperiences
              .filter(ar => ar.experience.user.id === user?.id)
              .map(item => {
                return (
                  <div className={styles.experienceCard} key={item.experience.id}>
                    <Checkbox
                      checked={
                        selectedExperience
                          ? selectedExperience.filter(ar => ar === item.experience.id).length > 0
                          : false
                      }
                      onChange={() => {
                        item.experience.id && handleSelectExperience(item.experience.id);
                      }}
                      color="primary"
                      inputProps={{'aria-label': 'controlled'}}
                      classes={{root: styles.fill}}
                    />
                    <CardActionArea
                      onClick={() => {
                        item.experience.id && handleSelectExperience(item.experience.id);
                      }}
                      disableRipple
                      component="div">
                      <Grid
                        container
                        alignItems="center"
                        justifyContent="space-between"
                        wrap="nowrap">
                        <CardMedia
                          component="img"
                          className={styles.image}
                          image={item.experience.experienceImageURL ?? DEFAULT_IMAGE}
                        />
                        <CardContent classes={{root: styles.cardContent}}>
                          <Typography className={styles.title} variant="body1">
                            {item.experience.name}
                          </Typography>
                          <Typography variant="caption" color="primary">
                            {item.experience.user.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {item ? ` ${i18n.t('Experience.Modal_Add_Post.Card_Own')}` : ''}
                          </Typography>
                        </CardContent>
                      </Grid>
                    </CardActionArea>
                  </div>
                );
              })
          )}
          <ShowIf
            condition={
              userExperiences.filter(ar => ar.experience.user.id === user?.id).length === 0
            }>
            <div className={styles.containerEmpty}>
              <Empty
                title={i18n.t('Experience.Modal_Add_Post.Empty_Title')}
                subtitle={i18n.t('Experience.Modal_Add_Post.Empty_Subtitle')}
                height={true}
                margin={false}
              />
            </div>
          </ShowIf>
        </div>
        <Button
          size="small"
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleConfirm}
          disabled={
            loading || userExperiences.filter(ar => ar.experience.user.id === user?.id).length === 0
          }>
          {i18n.t('Experience.Modal_Add_Post.Btn_Confirm')}
        </Button>
      </Modal>
    </>
  );
};
