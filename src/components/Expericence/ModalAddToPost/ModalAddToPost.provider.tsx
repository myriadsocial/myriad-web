import { InformationCircleIcon } from '@heroicons/react/outline';

import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Button,
  CardActionArea,
  CardContent,
  Checkbox,
  Grid,
  IconButton,
  SvgIcon,
  Tooltip,
  Typography,
} from '@material-ui/core';

import ModalAddToPostContext, {
  HandleConfirmAddPostExperience,
} from './ModalAddToPost.context';
import { ModalAddPostExperienceProps } from './ModalAddToPost.interface';
import { useStyles } from './ModalAddToPost.styles';

import { useTimelineFilter } from 'components/PostList/hooks/use-timeline-filter.hook';
import { Avatar } from 'components/atoms/Avatar';
import { Empty } from 'components/atoms/Empty';
import { useEnqueueSnackbar } from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import ShowIf from 'components/common/show-if.component';
import { Skeleton } from 'src/components/Expericence';
import { Modal } from 'src/components/atoms/Modal';
import { useExperienceHook } from 'src/hooks/use-experience-hook';
import {
  Experience,
  UserExperience,
  WrappedExperience,
} from 'src/interfaces/experience';
import * as ExperienceAPI from 'src/lib/api/experience';
import i18n from 'src/locale';
import { RootState } from 'src/reducers';
import * as constants from 'src/reducers/timeline/constants';
import { UserState } from 'src/reducers/user/reducer';

type ExperienceItemProps = {
  item: WrappedExperience;
  selectedExperience: string[];
  handleSelectExperience: (propsSelectedExperience: string) => void;
  handleSelectExperienceItem: (propsSelectedExperienceItem: Experience) => void;
};

const ExperienceItem = ({
  item,
  selectedExperience,
  handleSelectExperience,
  handleSelectExperienceItem,
}: ExperienceItemProps) => {
  const styles = useStyles();

  return (
    <div className={styles.experienceCard}>
      <Checkbox
        checked={
          selectedExperience
            ? selectedExperience.filter(ar => ar === item.experience.id)
                .length > 0
            : false
        }
        onChange={() => {
          item.experience.id
            ? (handleSelectExperience(item.experience.id),
              handleSelectExperienceItem(item.experience))
            : null;
        }}
        color="primary"
        inputProps={{ 'aria-label': 'controlled' }}
        classes={{ root: styles.fill }}
      />
      <CardActionArea
        onClick={() => {
          item.experience.id
            ? (handleSelectExperience(item.experience.id),
              handleSelectExperienceItem(item.experience))
            : null;
        }}
        disableRipple
        component="div">
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          wrap="nowrap">
          <Avatar
            name={item.experience.name}
            src={item.experience.experienceImageURL}
            variant="rounded"
            className={styles.image}
          />
          <CardContent classes={{ root: styles.cardContent }}>
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
};

export const ModalAddToPostProvider: React.ComponentType<ModalAddPostExperienceProps> =
  ({ children }) => {
    const styles = useStyles();
    const { user } = useSelector<RootState, UserState>(
      state => state.userState,
    );
    const {
      loadExperiencePostList,
      loadExperienceAdded,
      addPostsToExperience,
    } = useExperienceHook();
    const { posts } = useTimelineFilter();
    const enqueueSnackbar = useEnqueueSnackbar();
    const dispatch = useDispatch();

    const [postId, setPostId] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [isSelectAll, setIsSelectAll] = useState(false);
    const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
    const [selectedExperienceItem, setSelectedExperienceItem] = useState<
      Experience[]
    >([]);
    const [userExperiences, setUserExperiences] = useState<UserExperience[]>(
      [],
    );
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [otherExperience, setOtherExperience] = useState<Experience[]>([]);
    const [changed, setChanged] = useState<boolean>(false);

    const toolTipText = i18n.t('Experience.Modal_Add_Post.Tooltip_Text');

    const addPostToExperience = useCallback<HandleConfirmAddPostExperience>(
      async props => {
        setOpen(true);
        const tmpAddedExperience: string[] = [];
        await loadExperienceAdded(props.post.id, postsExperiences => {
          setOtherExperience(postsExperiences);
          postsExperiences.map(item => {
            tmpAddedExperience.push(item.id);
          });
        });

        loadExperiencePostList(props.post.id, postsExperiences => {
          setPostId(props.post.id);
          const tmpSelectedExperience: string[] = [];
          const tmpSelectedExperienceItem: Experience[] = [];
          postsExperiences.map(item => {
            if (tmpAddedExperience.find(post => post === item.id)) {
              tmpSelectedExperience.push(item.id);
              tmpSelectedExperienceItem.push(item);
            }
          });
          setSelectedExperience(tmpSelectedExperience);
          setSelectedExperienceItem(tmpSelectedExperienceItem);
        });
      },
      [userExperiences],
    );

    const handleClose = useCallback(() => {
      setOpen(false);
      setSelectedExperience([]);
    }, []);

    const handleSelectAllExperience = () => {
      const tmpUserExperience = [...userExperiences].filter(
        ar => ar.userId === user?.id,
      );
      let tmpSelectedExperience: string[] = [];
      let tmpSelectedExperienceItem: Experience[] = [];
      if (!isSelectAll) {
        tmpUserExperience.map(item => {
          tmpSelectedExperience.push(item.experience.id);
          tmpSelectedExperienceItem.push(item.experience);
        });
      } else {
        tmpSelectedExperience = [];
        tmpSelectedExperienceItem = [];
      }
      setSelectedExperience(tmpSelectedExperience);
      setSelectedExperienceItem(tmpSelectedExperienceItem);
      setIsSelectAll(!isSelectAll);
    };

    const handleSelectExperience = (propsSelectedExperience: string) => {
      const tmpSelectedExperience = [...selectedExperience];
      if (
        tmpSelectedExperience.filter(ar => ar === propsSelectedExperience)
          .length > 0
      ) {
        const indexRemovedExperience = tmpSelectedExperience.indexOf(
          propsSelectedExperience,
        );
        tmpSelectedExperience.splice(indexRemovedExperience, 1);
      } else {
        tmpSelectedExperience.push(propsSelectedExperience);
      }
      setSelectedExperience(tmpSelectedExperience);
    };

    const handleSelectExperienceItem = (
      propsSelectedExperienceItem: Experience,
    ) => {
      const tmpSelectedExperienceItem = [...selectedExperienceItem];
      if (
        tmpSelectedExperienceItem.filter(
          ar => ar.id === propsSelectedExperienceItem.id,
        ).length > 0
      ) {
        const indexRemovedExperienceItem = tmpSelectedExperienceItem.indexOf(
          propsSelectedExperienceItem,
        );
        tmpSelectedExperienceItem.splice(indexRemovedExperienceItem, 1);
      } else {
        tmpSelectedExperienceItem.push(propsSelectedExperienceItem);
      }
      setSelectedExperienceItem(tmpSelectedExperienceItem);
    };

    const movePosts = (input, from, to) => {
      const element = input[from];
      input.splice(from, 1);
      input.splice(to, 0, element);

      return input;
    };

    const updatePosts = () => {
      const updated = posts.map(post => {
        if (post.id === postId) {
          const others = otherExperience.filter(item => {
            const check = selectedExperience.find(exp => exp === item.id);
            if (!check) return item;
          });
          post.totalExperience = others.length + selectedExperience.length;
          post.experiences = selectedExperienceItem;
        }

        return post;
      });

      const index = updated.findIndex(post => post.id === postId);

      const result = movePosts(updated, index, 0);
      return result;
    };

    const handleConfirm = () => {
      if (postId) {
        addPostsToExperience(postId, selectedExperience, () => {
          setOpen(false);
          enqueueSnackbar({
            message: i18n.t('Experience.Modal_Add_Post.Success_Msg'),
            variant: 'success',
          });
          dispatch({
            type: constants.ADD_POSTS_TO_TIMELINE,
            posts: updatePosts(),
          });
        });
      }
    };

    const fetchUserExperiences = async () => {
      setLoading(true);
      const { meta, data: experiences } =
        await ExperienceAPI.getUserExperiences(user.id, undefined, page);

      setUserExperiences([...userExperiences, ...experiences]);

      setLoading(false);
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

    useEffect(() => {
      const current = otherExperience
        .filter(item => {
          const check = selectedExperience.find(exp => exp === item.id);
          if (check) return item;
        })
        .map(item => item.id);
      current.sort((a, b) => {
        return a >= b ? 1 : -1;
      });
      selectedExperience.sort((a, b) => {
        return a >= b ? 1 : -1;
      });

      console.log({ current, selectedExperience });

      setChanged(
        JSON.stringify(selectedExperience) !== JSON.stringify(current),
      );
    }, [userExperiences, selectedExperience]);

    return (
      <>
        <ModalAddToPostContext.Provider value={addPostToExperience}>
          {children}
        </ModalAddToPostContext.Provider>
        <Modal
          title={i18n.t('Experience.Modal_Add_Post.Title')}
          subtitle={
            <Typography>
              <Typography>
                {i18n.t('Experience.Modal_Add_Post.Subtitle_1')}
              </Typography>
              <Typography>
                {i18n.t('Experience.Modal_Add_Post.Subtitle_2')}
              </Typography>
            </Typography>
          }
          open={open}
          onClose={handleClose}>
          <div className={styles.root}>
            <div className={styles.options}>
              <div className={styles.flex}>
                <Typography>
                  {i18n.t('Experience.Modal_Add_Post.Tooltip')}
                </Typography>
                <Tooltip title={toolTipText} arrow>
                  <IconButton
                    aria-label="info"
                    className={styles.info}
                    style={{ color: '#404040' }}>
                    <SvgIcon
                      component={InformationCircleIcon}
                      viewBox="0 0 24 24"
                    />
                  </IconButton>
                </Tooltip>
              </div>
              <div className={styles.flex}>
                <Checkbox
                  checked={isSelectAll}
                  color="primary"
                  onChange={handleSelectAllExperience}
                  inputProps={{ 'aria-label': 'controlled' }}
                  classes={{ root: styles.fill }}
                  disabled={loading}
                />
                <Typography
                  component="span"
                  color="textPrimary"
                  className={styles.selected}>
                  {i18n.t('Experience.Modal_Add_Post.Select_All')}
                </Typography>
              </div>
            </div>
            <div></div>
          </div>

          <div
            id="selectable-experience-list"
            className={styles.experienceList}>
            {userExperiences
              .filter(ar => ar.userId === user?.id && ar.subscribed === false)
              .map(item => {
                return (
                  <ExperienceItem
                    key={item.id}
                    item={item}
                    selectedExperience={selectedExperience}
                    handleSelectExperience={handleSelectExperience}
                    handleSelectExperienceItem={handleSelectExperienceItem}
                  />
                );
              })}
            {loading && <Skeleton />}

            <ShowIf
              condition={
                userExperiences.filter(ar => ar.userId === user?.id).length ===
                  0 && !loading
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
            disabled={loading || selectedExperience.length === 0 || !changed}>
            {i18n.t('Experience.Modal_Add_Post.Btn_Confirm')}
          </Button>
        </Modal>
      </>
    );
  };
