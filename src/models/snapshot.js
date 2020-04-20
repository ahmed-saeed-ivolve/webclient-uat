import * as GenericService from '@/pages/service/services/generic_service';
import { routerRedux } from 'dva/router';
import { notification } from 'antd';

export default {
  namespace: 'snapshot',
  state: {
    list: [],
    createSnapshot: {
      payload: {},
    },
    calledBefore: false,
    selectedRows: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/service/storage/snapshots') {
          dispatch({
            type: 'update',
            payload: { method: 'Volume.snapshots' },
          });
        }
      });
    },
  },

  effects: {
    *createSnapshotFromVolume({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          createSnapshot: {
            payload: payload,
          },
        },
      });
    },

    *createSnapshotFromInstance({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          createSnapshot: {
            payload: payload,
          },
        },
      });
    },

    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          text: 'page init',
        },
      });
    },

    *delete({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          list: [],
        },
      });
    },
    *deleteResources({ payload }, { call, put }) {
      const data = yield call(GenericService.patch, {
        data: payload,
        method: 'Volume.delete_snapshot',
      });
      if (data?.statusCode === 200) {
        yield put({
          type: 'deleteItem',
          payload: { payload: payload.id, deleteResult: data.body },
        });

        if (data.body.error.length === 0) {
          notification.success({
            message: `Snapshots`,
            description: `${data.body.success.length} Snapshot(s) deleted successfully`,
          });
        } else if (data.body.success.length === 0) {
          notification.error({
            message: `Snapshots`,
            description: `${data.body.error.length} Snapshot(s) failed to delete`,
          });
        } else {
          notification.success({
            message: `Snapshots`,
            description: `${data.body.success.length} Snapshot(s) deleted successfully`,
          });

          notification.error({
            message: `Volume`,
            description: `${data.body.error.length} Volumes(s) failed to delete`,
          });
        }
      }
    },
    *create({ payload }, { call, put }) {
      const data = yield call(GenericService.create, {
        data: { ...payload },
        method: 'Volume.create_snapshot',
      });

      if (data) {
        yield put({
          type: 'saveSingle',
          payload: {
            ...data.body,
          },
        });

        notification.success({
          message: 'Snapshot',
          description: `Snapshot created successfully from ${data.body.name}`,
        });
        yield put(routerRedux.push('/service/storage/snapshots'));
      }
    },
    *update({ payload }, { call, put, select }) {
      const calledBefore = yield select(state => state.snapshot.calledBefore);

      if (!calledBefore || payload?.force === true) {
        const data = yield call(GenericService.query, payload);

        if (data) {
          yield put({
            type: 'save',
            payload: {
              list: data.body,
              calledBefore: true,
            },
          });
        }
      }
    },
  },
  reducers: {
    deleteItem(state, action) {
      let currentList = state.list;
      let filteredList = state.selectedRows.filter(
        item => !action.payload.deleteResult.success.includes(item),
      );
      const instancesNewList = currentList.filter(
        items => !action.payload.deleteResult.success.includes(items.id),
      );
      return { ...state, list: instancesNewList, selectedRows: filteredList };
    },

    selectedRows(state, action) {
      const { selectedRows } = state;
      const { payload } = action;

      const newSelectedKeys = payload.reduce((acc, record) => {
        if (acc.includes(record.id)) {
          return acc.filter(id => id !== record.id);
        } else {
          return [...acc, record.id];
        }
      }, selectedRows);

      return { ...state, selectedRows: [...newSelectedKeys] };
    },
    sdAllRows(state, action) {
      const { value, records } = action.payload;
      return {
        ...state,
        selectedRows: value ? records.map(record => record.id) : [],
      };
    },

    save(state, action) {
      return { ...state, ...action.payload };
    },
    clear(state, action) {
      return {
        ...state,
        createSnapshot: {
          payload: {},
        },
      };
    },
    saveSingle(state, action) {
      return {
        ...state,
        list: [...state.list, { ...action.payload }],
        createSnapshot: { payload: '' },
      };
    },
  },
};
