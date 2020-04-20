import * as FlavorServices from '../pages/service/compute/Flavors/services/flavor';
import * as GenericService from '@/pages/service/services/generic_service';
import { routerRedux } from 'dva/router';
import { notification } from 'antd';

export default {
    namespace: 'flavor',
    state: {
        list: [],
        calledBefore: false,
        selectedRows: [],
        listDb: [],
        updateFlavor: {},
        showmodal: false,
        loading: [],
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (
                    pathname.includes('/service/compute/') ||
                    pathname.includes('/service/iam/')
                ) {
                    dispatch({
                        type: 'update',
                        payload: { method: 'Compute.list_flavors' },
                    });
                } else if (pathname.includes('/service/settings/')) {
                    dispatch({
                        type: 'fetchFlavors',
                    });
                }
            });
        },
    },
    effects: {
        *fetchFlavors({ payload }, { call, put }) {
            const data = yield call(GenericService.query, {
                method: '/list_flavors',
                config: 'pricing',
            });

            yield put.resolve({
                type: 'saveListFromDb',
                payload: data,
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
                data: [...payload],
                method: 'Compute.delete_flavor',
            });
            if (data?.statusCode === 200) {
                yield put({
                    type: 'deleteItem',
                    payload: payload,
                });
            }
        },
        *create({ payload }, { call, put }) {
            const data = yield call(GenericService.create, {
                data: payload,
                method: '/create_flavor',
                config: 'pricing',
            });

            if (data?.status === 200) {
                yield put.resolve({
                    type: 'saveSingle',
                    payload: {
                        ...data.data.body.data,
                    },
                });
                notification.success({
                    message: ` Create Flavor`,
                    description: 'flavor created successfully',
                });
                yield put(routerRedux.push('/service/settings/flavors'));
            } else {
                notification.error({
                    message: `failed to create flavor`,
                });
            }
        },
        *update({ payload }, { call, put, select }) {
            const calledBefore = yield select(
                state => state.flavor.calledBefore
            );
            const force = payload?.force;
            if (!calledBefore || force) {
                const data = yield call(GenericService.query, {
                    method: 'Compute.list_flavors',
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
        *updateFromDb({ payload }, { call, put, select }) {
            const data = yield call(GenericService.query, {
                querystring: payload,
                method: '/update_flavor',
                config: 'pricing',
            });
            if (data?.status === 200) {
                yield put.resolve({
                    type: 'fetchFlavors',
                });

                notification.success({
                    message: 'Flavor Update',
                    description: 'successfully updated flavor',
                });
            }
            yield put.resolve({
                type: 'stopLoading',
            });
        },
        *edit({ payload }, { call, put, select }) {
            const data = yield call(GenericService.post, {
                data: [...payload],
                method: 'Compute.find_flavor',
            });
        },

        *singleFlavor({ payload }, { call, put, select }) {
            yield put({
                type: 'updateLoadingState',
                payload: { id: payload.id, type: 'add' },
            });

            yield put.resolve({
                type: 'updateSingle',
            });
        },
    },
    reducers: {
        deleteItem(state, action) {
            const filteredList = state.list.filter(
                items => !action.payload.includes(items.id)
            );
            return { ...state, list: filteredList };
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
        saveListFromDb(state, action) {
            return {
                ...state,
                listDb: action.payload,
            };
        },
        saveSingle(state, action) {
            return {
                ...state,
                listDb: [...state.listDb, { ...action.payload }],
            };
        },
        updateSingle(state, action) {
            return {
                ...state,
                showmodal: !state.showmodal,
            };
        },

        stopLoading(state, action) {
            return {
                ...state,
                loading: [],
            };
        },

        updateLoadingState(state, action) {
            return {
                ...state,
                loading:
                    action.payload.type === 'add'
                        ? [...state.loading, action.payload.id]
                        : state.loading.filter(id => id !== action.payload.id),
            };
        },
    },
};
