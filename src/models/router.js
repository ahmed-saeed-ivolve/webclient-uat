import * as RouterServices from '../pages/service/network/Routers/services/router';
import * as GenericService from '@/pages/service/services/generic_service';
import { routerRedux } from 'dva/router';
import { Button, notification, message } from 'antd';

export default {
    namespace: 'router',
    state: {
        text: 'page work',
        list: [],
        portList: [],
        calledBeforeRouters: false,
        calledBeforePorts: false,
        selectedRows: [],
        formsData: {},
        loading: [],
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname.includes('/service/network')) {
                    dispatch({
                        type: 'update',
                        payload: { method: 'Network.routers' },
                    });
                    dispatch({
                        type: 'fetchPort',
                        payload: { method: 'Network.ports' },
                    });
                    dispatch({
                        type: 'securitygroup/update',
                        payload: { method: 'Network.security_groups' },
                    });
                    dispatch({
                        type: 'vpc/fetchSubnets',
                        payload: { method: 'Network.subnets' },
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

        *deletePort({ payload }, { call, put, select }) {
            yield put({
                type: 'updateLoadingState',
                payload: { id: payload, type: 'add' },
            });
            const data = yield call(GenericService.patch, {
                data: { port_id: payload },
                method: 'Network.delete_port',
            });

            if (data?.statusCode === 200) {
                yield put({
                    type: 'saveAfterDeletingSinglePort',
                    payload: { port_id: payload },
                });
                notification.success({
                    message: `Port`,
                    description: `port deleted successfully`,
                });
            }
            yield put({
                type: 'updateLoadingState',
                payload: { id: payload, type: 'remove' },
            });
        },

        *createPort({ payload }, { call, put }) {
            const data = yield call(GenericService.create, {
                data: payload,
                method: 'Network.create_port',
            });

            if (data?.statusCode === 200) {
                if (Object.keys(data).includes('body')) {
                    yield put({
                        type: 'saveAfterCreatingSinglePort',
                        payload: [data.body, payload.network_id],
                    });
                }

                yield put({
                    type: 'drawer/closeDrawer',
                });
            }
        },

        *updatePort({ payload }, { call, put }) {
            const data = yield call(GenericService.create, {
                data: payload,
                method: 'Network.update_port',
            });

            if (data?.statusCode === 200) {
                if (Object.keys(data).includes('body')) {
                    yield put({
                        type: 'saveAfterUpdatingSinglePort',
                        payload: { ...data.body },
                    });
                }
            }
        },

        *deleteResources({ payload }, { call, put }) {
            const data = yield call(GenericService.patch, {
                data: payload,
                method: 'Network.delete_router',
            });

            if (data?.statusCode === 200) {
                yield put({
                    type: 'deleteItem',

                    payload: { payload: payload.id, deleteResult: data.body },
                });

                if (data.body.error.length === 0) {
                    notification.success({
                        message: `Routers`,
                        description: `${data.body.success.length} router(s) deleted successfully`,
                    });
                } else if (data.body.success.length === 0) {
                    notification.error({
                        message: `Routers`,
                        description: `${data.body.error.length} router(s) failed to delete`,
                    });
                } else {
                    notification.success({
                        message: `Routers`,
                        description: `${data.body.success.length} router(s) deleted successfully`,
                    });

                    notification.error({
                        message: `Routers`,
                        description: `${data.body.error.length} router(s) failed to delete`,
                    });
                }
            }
        },

        *fetchPort({ payload }, { call, put, select }) {
            const calledBeforePorts = yield select(
                state => state.router.calledBeforePorts
            );

            if (!calledBeforePorts || payload?.force === true) {
                const data = yield call(GenericService.query, {
                    method: 'Network.ports',
                });

                if (data) {
                    yield put({
                        type: 'save',
                        payload: {
                            portList: data.body,
                            calledBeforePorts: true,
                        },
                    });
                }
            }
        },

        *deleteInterface({ payload }, { call, put }) {
            const data = yield call(GenericService.patch, {
                data: payload,
                method: 'Network.remove_interface_from_router',
            });
            if (data) {
                yield put({
                    type: 'deleteSinglePort',
                    payload: {
                        port_id: payload.port_id,
                    },
                });
                notification.success({
                    message: 'Interface',
                    description: 'Interface deleted successfully',
                });
            }
        },

        *addInterface({ payload }, { call, put }) {
            const data = yield call(GenericService.patch, {
                data: payload,
                method: 'Network.add_interface_to_router',
            });
            if (data) {
                if (data?.body?.NeutronError) {
                    notification.error({
                        message: `Interface`,
                        description: `${data?.body?.NeutronError?.message}`,
                    });
                } else {
                    yield put({
                        type: 'saveSinglePort',
                        payload: {
                            portList: data.body,
                        },
                    });
                    message.success('Interface Added');
                }
            }
            yield put({
                type: 'router/update',
                payload: {
                    force: true,
                },
            });
        },

        *attachdetach({ payload }, { call, put }) {
            const data = yield call(RouterServices.attachdetach, {
                data: { ...payload },
            });
            if (data?.statusCode === 200) {
                yield put({
                    type: 'save',
                });
            }
        },

        *create({ payload }, { call, put }) {
            const data = yield call(GenericService.create, {
                data: { ...payload },
                method: 'Network.create_router',
            });
            if (data) {
                yield put({
                    type: 'saveSingleRouter',
                    payload: {
                        ...data.body,
                    },
                });
                notification.success({
                    message: 'Router',
                    description: 'router created successfully',
                });
                yield put(routerRedux.push('/service/network/routers'));
            }
        },
        *update({ payload }, { call, put, select }) {
            const calledBeforeRouters = yield select(
                state => state.router.calledBeforeRouters
            );
            const force = payload?.force;
            if (!calledBeforeRouters || force) {
                const data = yield call(
                    GenericService.query,
                    //payload
                    { method: 'Network.routers' }
                );

                if (data) {
                    yield put({
                        type: 'save',
                        payload: {
                            list: data.body,
                            calledBeforeRouters: true,
                        },
                    });
                }
            }
        },
    },
    reducers: {
        updateFormData(state, { payload }) {
            return {
                ...state,
                formsData: {
                    ...state.formsData,
                    ...payload,
                },
            };
        },

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

        saveAfterCreatingSinglePort(state, action) {
            return {
                ...state,
                portList: [...state.portList, { ...action.payload[0] }],
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

        saveSinglePort(state, action) {
            const newPortList = [
                ...state.portList,
                { ...action.payload.portList },
            ];
            return { ...state, portList: newPortList };
        },

        deleteSinglePort(state, action) {
            const newPortList = state.portList.filter(
                item => item.id !== action.payload.port_id
            );
            return { ...state, portList: newPortList };
        },

        saveAfterDeletingSinglePort(state, action) {
            let filteredPorts = state.portList.filter(
                item => item.id !== action.payload.port_id
            );
            return {
                ...state,
                portList: [...filteredPorts],
            };
        },

        saveAfterUpdatingSinglePort(state, action) {
            let filteredPorts = state.portList.map(item =>
                item.id === action.payload.id ? action.payload : item
            );
            return {
                ...state,
                portList: [...filteredPorts],
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

        saveSingleRouter(state, action) {
            return { ...state, list: [...state.list, { ...action.payload }] };
        },
    },
};
