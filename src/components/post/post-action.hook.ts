import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';

import {Post} from 'src/interfaces/post';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const usePostActionHook = (post: Post) => {
  const {user, anonymous} = useSelector<RootState, UserState>(state => state.userState);
  const [tippingEnabled, setTippingEnabled] = useState(false);
  const [isPostOwner, setIsPostOwner] = useState(false);

  useEffect(() => {
    if (user) {
      checkTippingEnabled();
      checkOwnPost();
    }
  }, [user, post]);

  const checkTippingEnabled = (): void => {
    if (anonymous) {
      setTippingEnabled(false);
    }

    if (user) {
      setTippingEnabled(user.id !== post.platformUser?.platform_account_id);
    } else {
      setTippingEnabled(false);
    }
  };

  const checkOwnPost = () => {
    if (anonymous) {
      setIsPostOwner(false);
    }

    if (user) {
      setIsPostOwner(user.id === post.platformUser?.platform_account_id);
    } else {
      setIsPostOwner(false);
    }
  };

  return {
    tippingEnabled,
    isPostOwner,
  };
};
