import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {RootState} from 'src/reducers';
import {fetchImporter} from 'src/reducers/importers/actions';
import {ImporterState} from 'src/reducers/importers/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const useImporterHook = () => {
  const dispatch = useDispatch();
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {importers, meta} = useSelector<RootState, ImporterState>(state => state.importersState);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async (originPostId: string, platform: string, page = 1) => {
    if (!user) return;

    setLoading(true);
    try {
      dispatch(fetchImporter(originPostId, platform, page));
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  return {
    load,
    loading,
    importers,
    meta,
    error,
  };
};
