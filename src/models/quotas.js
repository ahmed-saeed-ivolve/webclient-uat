import * as GenericService from '@/pages/service/services/generic_service';
import download from '@/utils/download';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'quotas',
  state: {

  },
  subscriptions: {
    setup({ dispatch, history }) {

      return history.listen(({ pathname, query }) => {

        if (pathname === '/quota') {

          dispatch({
            type: 'fetchQuotasInstances',
          });

          dispatch({
            type: 'fetchQuotaNetworks'
          })

        }
      });
    },
  },
  effects: {

    *fetchQuotasInstances({ payload }, { call, put, select }) {

      const data = yield call(GenericService.query, { method: 'Compute.get_quotas' });
      if (data) {
        yield put({
          type: 'save',
          payload: {
            ...data.body
          },
        });
      }
    },
    *fetchQuotaNetworks({ payload }, { call, put, select }) {

      const data = yield call(GenericService.query, { method: 'Network.get_quotas' });
      if (data) {
        yield put({
          type: 'save',
          payload: {
            ...data.body
          },
        });
      }
    }
  },


  reducers: {

    save(state, action) {

      return { ...state, ...action.payload };

    },
  },
};
