import * as VPCServices from '../pages/service/network/VirtualPrivateCloud/services/vpc';
import * as GenericService from '@/pages/service/services/generic_service';
import * as NetworkService from '../pages/service/network/VirtualPrivateCloud/services/vpc';
import { routerRedux } from 'dva/router';
import { Button, notification, message } from 'antd';

export default {
    namespace: 'vpc',
    state: {
        list: [],
        selectedRows: [],
        subnetList: [],
        calledBeforeNetwork: false,
        calledBeforeSubnet: false,
        selectedNetwork: null,
        formsData: { is_dhcp_enabled: true, enable_gateway: true },
        loading: [],
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname.includes('/service/network')) {
                    dispatch({
                        type: 'update',
                        payload: { method: 'Network.networks' },
                    });
                    dispatch({
                        type: 'fetchSubnets',
                        payload: { method: 'Network.subnets' },
                    });
                }
            });
        },
    },
    effects: {
        *create({ payload }, { call, put }) {
            const data = yield call(GenericService.create, {
                data: payload,
                method: 'Network.create_network',
            });

            if (data) {
                yield put({
                    type: 'saveSingleNetworkWithSubnet',
                    payload: data.body,
                });
                notification.success({
                    message: `Network`,
                    description: `network created successfully`,
                });
            }
            yield put(routerRedux.push('/service/network/networks'));
        },

        *createSubnet({ payload }, { call, put }) {
            const data = yield call(GenericService.create, {
                data: payload,
                method: 'Network.create_subnet',
            });

            if (data?.statusCode === 200) {
                if (Object.keys(data).includes('body')) {
                    yield put({
                        type: 'saveAfterCreatingSingleSubnet',
                        payload: [data.body, payload.network_id],
                    });
                } else {
                    yield put({
                        type: 'saveAfterCreatingNetwork',
                        payload: [data.body, payload.network_id],
                    });
                }

                yield put({
                    type: 'drawer/closeDrawer',
                });
            }
        },

        *updateSubnet({ payload }, { call, put }) {
            const data = yield call(GenericService.create, {
                data: payload,
                method: 'Network.update_subnet',
            });

            if (data?.statusCode === 200) {
                yield put({
                    type: 'updateSingleSubnet',
                    payload: { ...data.body.subnet },
                });
            }
        },

        *deleteSubnet({ payload }, { call, put, select }) {
            yield put({
                type: 'updateLoadingState',
                payload: { id: payload.subnet_id, type: 'add' },
            });
            const data = yield call(GenericService.patch, {
                data: payload,
                method: 'Network.delete_subnet',
            });

            if (data?.statusCode === 200) {
                yield put({
                    type: 'saveAfterDeletingSingleSubnet',
                    payload: [data.body, payload.network_id],
                });
                notification.success({
                    message: `Subnet`,
                    description: `subnet deleted successfully`,
                });
            }
            yield put({
                type: 'updateLoadingState',
                payload: { id: payload.subnet_id, type: 'remove' },
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
                method: 'Network.delete_network',
            });

            if (data?.statusCode === 200) {
                yield put({
                    type: 'deleteItem',

                    payload: { payload: payload.id, deleteResult: data.body },
                });

                if (data.body.error.length === 0) {
                    notification.success({
                        message: `Networks`,
                        description: `${data.body.success.length} networks(s) deleted successfully`,
                    });
                } else if (data.body.success.length === 0) {
                    notification.error({
                        message: `Networks`,
                        description: `${data.body.error.length} networks(s) failed to delete`,
                    });
                } else {
                    notification.success({
                        message: `Networks`,
                        description: `${data.body.success.length} networks(s) deleted successfully`,
                    });

                    notification.error({
                        message: `Networks`,
                        description: `${data.body.error.length} networks(s) failed to delete`,
                    });
                }
            }
        },

        *fetchSubnets({ payload }, { call, put, select }) {
            const calledBeforeSubnet = yield select(
                state => state.vpc.calledBeforeSubnet
            );
            if (!calledBeforeSubnet || payload?.force) {
                const data = yield call(GenericService.query, payload);
                if (data) {
                    yield put({
                        type: 'save',
                        payload: {
                            subnetList: data.body,
                            calledBeforeSubnet: true,
                        },
                    });
                }
            }
        },

        *showCurrentNetwork({ payload }, { call, put, select }) {
            const { id } = payload;

            let network = null;

            const vpcList = yield select(state => state.vpc.list);

            if (vpcList.length === 0) {
                yield put.resolve({
                    type: 'update',
                    payload: { method: 'Network.networks' },
                });

                const newList = yield select(state => state.vpc.list);

                network = newList.filter(record => record.id === id);
            } else {
                network = vpcList.filter(record => record.id === id);
            }

            yield put.resolve({
                type: 'selectedRows',
                payload: network,
            });

            yield put({
                type: 'addCurrentNetwork',
                payload: {
                    network,
                },
            });
        },

        *update({ payload }, { call, put, select }) {
            const calledBeforeNetwork = yield select(
                state => state.vpc.calledBeforeNetwork
            );
            if (!calledBeforeNetwork || payload?.force === true) {
                const data = yield call(GenericService.query, {
                    method: 'Network.networks',
                });
                if (data) {
                    yield put({
                        type: 'save',
                        payload: {
                            list: data.body,
                            calledBeforeNetwork: true,
                        },
                    });
                }
            }
        },
    },
    reducers: {
        updateLoadingState(state, action) {
            return {
                ...state,
                loading:
                    action.payload.type === 'add'
                        ? [...state.loading, action.payload.id]
                        : state.loading.filter(id => id !== action.payload.id),
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
        updateFormData(state, { payload }) {
            return {
                ...state,
                formsData: {
                    ...state.formsData,
                    ...payload,
                },
            };
        },

        saveSingleNetworkWithSubnet(state, action) {
            return {
                ...state,
                list: [...state.list, action.payload.network],
                subnetList: [...state.subnetList, action.payload.subnet],
                formsData: {},
            };
        },

        saveAfterCreatingSingleSubnet(state, action) {
            let selectedNetwork = {
                ...action.payload[0].network.filter(
                    item => item.id === action.payload[1]
                ),
            };
            return {
                ...state,
                list: [...action.payload[0].network],
                subnetList: [
                    ...state.subnetList,
                    { ...action.payload[0].subnet },
                ],
                selectedNetwork: selectedNetwork[0],
            };
        },

        saveAfterCreatingNetwork(state, action) {
            let selectedNetwork = {
                ...action.payload[0].network.filter(
                    item => item.id === action.payload[1]
                ),
            };
            return {
                ...state,
                list: [...action.payload[0].network],
                subnetList: [
                    ...state.subnetList,
                    { ...action.payload[0].subnet },
                ],
                selectedNetwork: selectedNetwork[0],
            };
        },

        saveAfterDeletingSingleSubnet(state, action) {
            let selectedNetwork = {
                ...action.payload[0].network.filter(
                    item => item.id === action.payload[1]
                ),
            };
            return {
                ...state,
                list: [...action.payload[0].network],
                subnetList: [...action.payload[0].subnets],
                selectedNetwork: selectedNetwork[0],
            };
        },

        addCurrentNetwork(state, action) {
            return {
                ...state,
                selectedNetwork: { ...action.payload.network[0] },
            };
        },

        removeCurrentShowNetwork(state) {
            if (state.selectedNetwork !== null) {
                const selectedNetwork = state.selectedNetwork.id;
                let filteredNetworks = state.selectedRows.filter(
                    elem => elem !== selectedNetwork
                );
                return {
                    ...state,
                    selectedNetwork: null,
                    selectedRows: filteredNetworks,
                };
            } else {
                return { ...state, selectedNetwork: null, selectedRows: [] };
            }
        },

        saveSingleSubnet(state, action) {
            return { ...state, list: [...state.list, { ...action.payload }] };
        },

        updateSingleSubnet(state, action) {
            let filteredSubnetList = state.subnetList.map(item =>
                item.id === action.payload.id ? action.payload : item
            );
            return { ...state, subnetList: filteredSubnetList };
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
        resetFormsData(state, { payload }) {
            return {
                ...state,
                formsData: {
                    is_dhcp_enabled: true,
                    enable_gateway: true,
                },
            };
        },
    },
};
