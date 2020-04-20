import * as KeypairServices from '../pages/service/compute/Keypairs/services/keypair';
import * as GenericService from '@/pages/service/services/generic_service';
import download from '@/utils/download';
import { routerRedux } from 'dva/router';
import { notification } from 'antd';

export default {
    namespace: 'keypair',
    state: {
        selectedRows: [],
        calledBefore: false,
        list: [],
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/service/compute/keypairs') {
                    dispatch({
                        type: 'update',
                        payload: { method: 'Compute.list_keypairs' },
                    });
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
        *deleteResources({ payload }, { call, put, select }) {
            const data = yield call(GenericService.patch, {
                data: payload,
                method: 'Compute.delete_keypair',
            });

            if (data?.statusCode === 200) {
                yield put({
                    type: 'deleteItem',
                    payload: { payload: payload, deleteResult: data.body },
                });
                notification.success({
                    message: 'Keypair',
                    description: 'keypair deleted successfully',
                });
            }
        },
        *create({ payload }, { call, put }) {
            const data = yield call(GenericService.create, {
                data: {
                    ...payload,
                    user_id: JSON.parse(localStorage.getItem('user')).id,
                },
                method: 'Compute.create_keypair',
            });

            if (data) {
                yield put({
                    type: 'saveSingle',
                    payload: {
                        ...data.body,
                    },
                });

                download(
                    data.body.private_key,
                    `${data.body.name}.pem`,
                    'text/plain'
                );

                yield put({
                    type: 'drawer/closeDrawer',
                });
                if (
                    !window.location.href.includes(
                        '/service/compute/elastic-cloud-services/create'
                    )
                ) {
                    yield put(routerRedux.push('/service/compute/keypairs'));
                }
            }
        },
        *update({ payload }, { call, put, select }) {
            const calledBefore = yield select(
                state => state.keypair.calledBefore
            );
            const force = payload?.force;
            if (!calledBefore || force) {
                const data = yield call(GenericService.query, {
                    method: 'Compute.list_keypairs',
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

        *clearPrivateKey({ payload }, { call, put, select }) {
            yield put({
                type: 'save',
                payload: {
                    privatekey: [],
                },
            });
        },
    },
    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        },
        saveSingle(state, action) {
            return { ...state, list: [...state.list, { ...action.payload }] };
        },
        deleteItem(state, action) {
            let currentList = state.list;

            let filteredList = state.selectedRows.filter(
                item => !action.payload.deleteResult.success.includes(item)
            );
            const instancesNewList = state.list.filter(
                items =>
                    !action.payload.deleteResult.success.includes(items.name)
            );
            return {
                ...state,
                list: instancesNewList,
                selectedRows: filteredList,
            };
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
    },
};
