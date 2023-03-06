import * as React from 'react';

import { useStyles } from './AddToTimeline.style';

import { Button, ButtonVariant } from 'components/atoms/Button';
import useModalAddToPost from 'src/components/Expericence/ModalAddToPost/useModalAddToPost.hook';
import { Post } from 'src/interfaces/post';
import i18n from 'src/locale';

const Icon = () => {
  return (
    <svg
      style={{ marginRight: 5 }}
      width="20"
      height="14"
      viewBox="0 0 20 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.0508 12.8633V3.25215C16.0508 2.09937 15.1202 1.16882 13.9674 1.16882H11.6619"
        stroke="black"
        strokeWidth="1.8"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.2461 10.6688L16.0517 12.8633L13.8572 10.6688"
        stroke="black"
        strokeWidth="1.8"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.86111 1.16882L3.86111 10.7799C3.86111 11.9327 4.79166 12.8633 5.94444 12.8633H8.25"
        stroke="black"
        strokeWidth="1.8"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.66579 3.36328L3.86022 1.16883L6.05469 3.36328"
        stroke="black"
        strokeWidth="1.8"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.66797 7H13.3346"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M10 10.3359L10 3.66927"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const ButtonAddToTimeline: React.FC<{ post: Post; mobile: boolean }> =
  props => {
    const { post, mobile } = props;
    const styles = useStyles({ mobile });
    const addPostToExperience = useModalAddToPost();

    const handleOpenAddPostToExperience = () => {
      const propsAddToPost = {
        post: post,
      };
      addPostToExperience(propsAddToPost);
    };
    return (
      <Button
        variant={ButtonVariant.OUTLINED}
        className={styles.button}
        onClick={handleOpenAddPostToExperience}>
        <Icon />
        {i18n.t('Post_Detail.Post_Options.Add_Post_To_Experience')}
      </Button>
    );
  };
