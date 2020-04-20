import * as GenericService from '@/pages/service/services/generic_service';
import { routerRedux } from 'dva/router';
import { notification, message } from 'antd';

export default {
    namespace: 'roles',
    state: {
        list: [],
        roleList: [],
        domainList: [],
        calledBefore: false,
        calledBeforeRoles: false,
        calledBeforeDomains: false,
        selectedRows: [],
        loading: [],
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname.includes('/service/iam/roles')) {
                    dispatch({
                        type: 'update',
                        payload: { method: 'IAM.roles' },
                    });
                    // dispatch({
                    //   type: 'fetchDomains',
                    //   payload: { method: 'IAM.domains' },
                    // });
                }
            });
        },
    },
    effects: {
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
                data: {role_id:payload.id},
                method: 'IAM.delete_role',
            });

            if (data?.statusCode === 200 || data?.statusCode === 204) {
                yield put({
                    type: 'deleteItem',
                    payload: payload.id,
                });
                notification.success({
                    message: `Roles`,
                    description: `role deleted successfully`,
                });
            }
            else {
                notification.error({
                    message: `Roles`,
                    description: `role failed to delete`,
                });
            }
        },

        *create({ payload }, { call, put }) {
            const data = yield call(GenericService.create, {
                data: { ...payload },
                method: 'IAM.create_role',
            });
            if (data) {
                yield put({
                    type: 'saveSingle',
                    payload: {
                        ...data.body,
                    },
                });

                if (data?.statusCode === 200) {
                    notification.success({
                        message: `Roles`,
                        description: `Role Created successfully`,
                    });

                    yield put(routerRedux.push('/service/iam/roles'));
                }
            }
        },

        *updateRole({ payload }, { call, put }) {
            const data = yield call(GenericService.create, {
                data: { ...payload },
                method: 'IAM.update_role',
            });
            if (data) {
                yield put({
                    type: 'saveSingle',
                    payload: {
                        ...data.body,
                    },
                });
                yield put(routerRedux.push('/service/iam/roles'));
            }
        },

        *fetchRoles({ payload }, { call, put, select }) {
            const calledBeforeRoles = yield select(
                state => state.roles.calledBeforeRoles
            );
            if (!calledBeforeRoles || payload?.force) {
                const data = yield call(GenericService.query, {
                    method: 'IAM.roles',
                });

                if (data) {
                    yield put({
                        type: 'saveRoles',
                        payload: {
                            roleList: data.body,
                            calledBeforeRoles: true,
                        },
                    });
                }
            }
        },

        *fetchDomains({ payload }, { call, put, select }) {
            const calledBeforeDomains = yield select(
                state => state.roles.calledBeforeDomains
            );
            if (!calledBeforeDomains) {
                const data = yield call(GenericService.query, {
                    method: 'IAM.domains',
                });

                if (data) {
                    yield put({
                        type: 'saveDomains',
                        payload: {
                            domainList: data.body,
                            calledBeforeDomains: true,
                        },
                    });
                }
            }
        },

        *update({ payload }, { call, put, select }) {
            const calledBefore = yield select(
                state => state.roles.calledBefore
            );
            if (!calledBefore || payload?.force) {
                const data = yield call(GenericService.query, {
                    method: 'IAM.roles',
                });

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
        saveOptions(state, action) {
            const list = state.list.map(item => {
                if (item.id === action.payload.options.id) {
                    return {
                        ...item,
                        ...action.payload.options,
                    };
                } else {
                    return item;
                }
            });
            return { ...state, list };
        },
        deleteItem(state, action) {
            const successList = action.payload.body.success;

            const filteredList = state.list.filter(
                items => !successList.includes(items.id)
            );
            return { ...state, list: filteredList };
        },

        selectedRows(state, action) {
            const { selectedRows } = state;
            const { payload } = action;

            const newSelectedKeys = payload.reduce((acc, record) => {
                if (acc.includes(record.id)) {
                    // return { ...state }
                    // return { ...state, selectedRows: state.selectedRows.filter(id => id !== action.payload.id) }
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

        saveRoles(state, action) {
            return { ...state, ...action.payload };
        },

        saveDomains(state, action) {
            return { ...state, ...action.payload };
        },

        saveSingle(state, action) {
            return { ...state, list: [...state.list, { ...action.payload }] };
        },
  
        updateLoadingState(state, action) {
            return {
                ...state,
                loading:
                    action.payload.type === 'add'
                        ? [
                              ...state.loading,
                              action.payload.id,
                              action.payload.switchChange,
                          ]
                        : state.loading.filter(id => id !== action.payload.id),
            };
        },
    },
};
