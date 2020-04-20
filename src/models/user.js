import { queryCurrent, query as queryUsers } from '@/services/user';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: undefined,
  },
  effects: {},
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload.user || {} };
    },
  },
};
export default UserModel;
