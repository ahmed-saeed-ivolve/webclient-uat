import * as GenericService from '@/pages/service/services/generic_service';
import { routerRedux } from 'dva/router';
import { Button, notification, message } from 'antd';
import { getPageQuery } from '@/utils/utils';

const statusCodeAndType = {
    success: (vm, status) => {
        return {
            message: `Instance ${status.toLowerCase()}`,
            description: `Your Instance '${vm}' is now in '${status}' state`,
        };
    },
};

const openNotificationWithIcon = type => {
    notification[type]({
        message: 'Notification Title',
        description:
            'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    });
};

function compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const nameA = a.name;
    const nameB = b.name;

    let comparison = 0;
    if (nameA > nameB) {
        comparison = 1;
    } else if (nameA < nameB) {
        comparison = -1;
    }
    return comparison;
}

export default {
    namespace: 'kms',
    state: {
        selectedRows: [],
        list: [],
        calledBefore: false,
        selectedKMS: null,
        loading: [],
        keysHasDataId: [],
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (
                    pathname.includes(
                        '/service/security/key-management-services'
                    )
                ) {
                    dispatch({
                        type: 'update',
                        payload: { method: 'Compute.list' },
                    });
                }
            });
        },
    },
    effects: {
        *showCurrentKMS({ payload }, { call, put, select }) {
            const { id } = payload;

            let instance = null;

            const kmsList = yield select(state => state.kms.list);

            if (kmsList.length === 0) {
                yield put.resolve({
                    type: 'update',
                    payload: { method: 'Security.list_kms' },
                });

                const newList = yield select(state => state.kms.list);

                instance = newList.filter(record => record.id === id);
            } else {
                instance = kmsList.filter(record => record.id === id);
            }

            yield put.resolve({
                type: 'selectedRows',
                payload: instance,
            });

            yield put({
                type: 'addCurrentKMS',
                payload: {
                    instance,
                },
            });
        },

        *deleteResources({ payload }, { call, put }) {
            const data = yield call(GenericService.patch, {
                data: { ...payload },
                method: '/delete_kms',
                config: 'security',
            });
            if (data?.statusCode === 200) {
                yield put({
                    type: 'deleteItem',
                    payload: { payload: payload.id, deleteResult: data.body },
                });

                if (data.body.error.length === 0) {
                    notification.success({
                        message: `KMS`,
                        description: `${data.body.success.length} key(s) deleted successfully`,
                    });
                } else if (data.body.success.length === 0) {
                    notification.error({
                        message: `KMS`,
                        description: `${data.body.error.length} key(s) failed to delete`,
                    });
                } else {
                    notification.success({
                        message: `KMS`,
                        description: `${data.body.success.length} key(s) deleted successfully`,
                    });

                    notification.error({
                        message: `KMS`,
                        description: `${data.body.error.length} key(s) failed to delete`,
                    });
                }
            }
        },

        *enable({ payload }, { call, put }) {
            yield put({
                type: 'updateLoadingState',
                payload: { id: payload.id, type: 'add' },
            });

            const data = yield call(GenericService.create, {
                data: { ...payload },
                method: '/enable_kms',
                config: 'security',
            });
            if (data?.body?.statusCode === 200) {
                yield put({
                    type: 'enableDisable',
                    payload: {
                        ...data.body,
                    },
                });
                notification.success({
                    message: 'KMS',
                    description: 'key enabled successfully',
                });
            }
            yield put({
                type: 'updateLoadingState',
                payload: { id: payload.id, type: 'remove' },
            });
        },

        *disable({ payload }, { call, put }) {
            yield put({
                type: 'updateLoadingState',
                payload: { id: payload.id, type: 'add' },
            });
            const data = yield call(GenericService.create, {
                data: { ...payload },
                method: '/disable_kms',
                config: 'security',
            });
            if (data?.body?.statusCode === 200) {
                yield put({
                    type: 'enableDisable',
                    payload: {
                        ...data.body,
                    },
                });
                notification.success({
                    message: 'KMS',
                    description: 'key disabled successfully',
                });
            }
            yield put({
                type: 'updateLoadingState',
                payload: { id: payload.id, type: 'remove' },
            });
        },

        *encrypt({ payload }, { call, put }) {
            const data = yield call(GenericService.patch, {
                data: payload,
                method: 'Security.encrypt_kms',
            });
        },

        *decrypt({ payload }, { call, put }) {
            const data = yield call(GenericService.patch, {
                data: payload,
                method: 'Security.decrypt_kms',
            });
        },

        *create({ payload }, { call, put }) {
            const data = yield call(GenericService.create, {
                data: { ...payload },
                method: '/create_kms',
                config: 'security',
            });
            if (data?.statusCode === 200) {
                yield put({
                    type: 'saveSingle',
                    payload: {
                        ...data.body,
                    },
                });
                yield put(
                    routerRedux.push(
                        '/service/security/key-management-services'
                    )
                );
                notification.success({
                    message: 'KMS',
                    description: 'key created successfully',
                });
            }
        },

        *update({ payload }, { call, put, select }) {
            const calledBefore = yield select(state => state.kms.calledBefore);

            if (!calledBefore || payload?.force === true) {
                const data = yield call(GenericService.query, {
                    method: '/list_kms',
                    config: 'security',
                });

                if (data?.statusCode === 200) {
                    yield put.resolve({
                        type: 'save',
                        payload: {
                            list: data.body.secrets.sort(compare),
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
                item => !action.payload.deleteResult.success.includes(item)
            );
            const instancesNewList = state.list.filter(
                items => !action.payload.deleteResult.success.includes(items.id)
            );
            return {
                ...state,
                list: instancesNewList,
                selectedRows: filteredList,
            };
        },

        save(state, action) {
            return { ...state, ...action.payload };
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
        saveSingle(state, action) {
            return {
                ...state,
                list: [...state.list, { ...action.payload }].sort(compare),
            };
        },

        addCurrentKMS(state, action) {
            return { ...state, selectedKMS: { ...action.payload.instance[0] } };
        },

        removeCurrentShowKMS(state) {
            if (state.selectedKMS !== null) {
                const selectedKMS = state.selectedKMS.id;
                let filtered = state.selectedRows.filter(
                    elem => elem !== selectedKMS
                );

                return { ...state, selectedKMS: null, selectedRows: filtered };
            } else {
                return { ...state, selectedKMS: null, selectedRows: [] };
            }
        },

        itemStatus(state, action) {
            const filteredList = state.list.map(items =>
                Object.values(action.payload.payload).includes(items.id)
                    ? (items = action.payload.data)
                    : items
            );
            return { ...state, list: state.list };
        },

        enableDisable(state, action) {
            var filteredList = state.list.map(item =>
                item.id === action.payload.id ? action.payload : item
            );
            return { ...state, list: filteredList };
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

        keysHasData(state, action) {
            return {
                ...state,
                keysHasDataId: [...state.keysHasDataId, action.payload.id],
            };
        },
    },
};
