import * as FloatingIpServices from '../pages/service/network/FloatingIPs/services/floatingip';
import * as GenericService from '@/pages/service/services/generic_service';
import { routerRedux } from 'dva/router';
import { notification } from 'antd';

export default {
    namespace: 'floatingip',
    state: {
        list: [],
        calledBefore: false,
        selectedRows: [],
        estimated_price: 0,
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/service/network/floating-ips') {
                    dispatch({
                        type: 'update',
                        payload: { method: 'Network.ips' },
                    });
                    dispatch({
                        type: 'update',
                        payload: { method: 'Network.ips' },
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
                method: 'Network.delete_ip',
            });
            if (data?.statusCode === 200) {
                yield put({
                    type: 'deleteItem',
                    payload: { payload: payload.id, deleteResult: data.body },
                });
                notification.success({
                    message: 'Elastic Ip',
                    description: 'Elastic Ip released successfully.',
                });
            }
        },
        *create({ payload }, { call, put }) {
            const data = yield call(GenericService.create, {
                data: { ...payload },
                method: 'Network.create_ip',
            });

            if (data) {
                yield put({
                    type: 'saveSingle',
                    payload: {
                        ...data.body,
                    },
                });
                notification.success({
                    message: 'Elastic Ip',
                    description: `Elastic Ip created successfully.`,
                });
                yield put(routerRedux.push('/service/network/floating-ips'));
            }
        },

        *fetchFloatingIPs({ payload }, { call, put, select }) {
            const data = yield call(GenericService.create, {
                data: payload,
                method: 'Network.get_ip_details',
            });

            if (data.statusCode === 200) {
                yield put({ type: 'saveSingle', payload: { ...data.body[0] } });
            }
        },

        *update({ payload }, { call, put, select }) {
            const calledBefore = yield select(
                state => state.floatingip.calledBefore
            );
            const force = payload?.force;

            if (!calledBefore || force) {
                const data = yield call(GenericService.query, {
                    method: 'Network.ips',
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
        *quote({ payload }, { call, put }) {
            const data = {
                resources: [
                    {
                        volume: payload.volume,
                        service: 'ip.floating',
                        desc: {},
                    },
                ],
            };
            let quote = yield call(GenericService.query, {
                method: payload.method,
                data,
            });
            yield put({
                type: 'save',
                payload: {
                    estimated_price: `SAR ${parseFloat(quote.body).toFixed(
                        2
                    )} / hour`,
                },
            });
        },
    },
    reducers: {
        deleteItem(state, action) {
            let currentList = state.list;
            let filteredList = state.selectedRows.filter(
                item => !action.payload.deleteResult.success.includes(item)
            );
            const instancesNewList = currentList.filter(
                items => !action.payload.deleteResult.success.includes(items.id)
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

        save(state, action) {
            return { ...state, ...action.payload };
        },
        saveSingle(state, action) {
            return { ...state, list: [...state.list, { ...action.payload }] };
        },
    },
};
