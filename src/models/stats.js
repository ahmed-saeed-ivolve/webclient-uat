import * as GenericService from '@/pages/service/services/generic_service';
import download from '@/utils/download';
import { routerRedux } from 'dva/router';

export default {
    namespace: 'stats',
    state: {
        vms: [],
        VmStatus: [],
        total: [],
        volumes: [],
        list: [],
        quotaInstances: [],
        quotaNetworks: [],
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                const scope = JSON.parse(
                    localStorage.getItem('detasadUserType')
                )?.[0];
                if (scope) {
                    if (pathname === '/') {
                        dispatch({
                            type: 'fetchInstances',
                        });
                        dispatch({
                            type: 'fetchTotalInstances',
                        });

                        dispatch({
                            type: 'fetchVolumes',
                        });
                        dispatch({
                            type: 'fetchTotalVolumes',
                        });
                        dispatch({
                            type: 'fetchTotalNetworks',
                        });
                        dispatch({
                            type: 'fetchTotalSnapshots',
                        });
                        dispatch({
                            type: 'fetchTotalSecurityGroups',
                        });
                        dispatch({
                            type: 'fetchTotalKeypairs',
                        });
                        dispatch({
                            type: 'fetchTotalRouters',
                        });
                        dispatch({
                            type: 'fetchTotalSubnets',
                        });

                        dispatch({
                            type: 'fetchQuotasInstances',
                        });

                        dispatch({
                            type: 'fetchQuotaNetworks',
                        });
                    }
                }
            });
        },
    },
    effects: {
        *fetchQuotasInstances({ payload }, { call, put, select }) {
            const data = yield call(GenericService.query, {
                method: 'Compute.get_quotas',
            });
            if (data) {
                yield put({
                    type: 'save',
                    payload: {
                        quotaInstances: data.body,
                    },
                });
            }
        },
        *fetchInstances({ payload }, { call, put, select }) {
            const data = yield call(GenericService.query, {
                method: 'Statistics.instance_status',
            });
            if (data) {
                yield put({
                    type: 'save',
                    payload: {
                        ...data.body,
                    },
                });
            }
        },

        *fetchTotalInstances({ payload }, { call, put, select }) {
            const data = yield call(GenericService.query, {
                method: 'Statistics.instances',
            });
            if (data) {
                yield put({
                    type: 'save',
                    payload: {
                        ...data.body,
                    },
                });
            }
        },

        *fetchVolumes({ payload }, { call, put, select }) {
            const data = yield call(GenericService.query, {
                method: 'Statistics.vm_status',
            });
            if (data) {
                yield put({
                    type: 'save',
                    payload: {
                        ...data.body,
                    },
                });
            }
        },

        *fetchTotalVolumes({ payload }, { call, put, select }) {
            const data = yield call(GenericService.query, {
                method: 'Statistics.volumes',
            });
            if (data) {
                yield put({
                    type: 'save',
                    payload: {
                        ...data.body,
                    },
                });
            }
        },
        *fetchTotalNetworks({ payload }, { call, put, select }) {
            const data = yield call(GenericService.query, {
                method: 'Statistics.networks',
            });
            if (data) {
                yield put({
                    type: 'save',
                    payload: {
                        ...data.body,
                    },
                });
            }
        },

        *fetchTotalSnapshots({ payload }, { call, put, select }) {
            const data = yield call(GenericService.query, {
                method: 'Statistics.snapshots',
            });
            if (data) {
                yield put({
                    type: 'save',
                    payload: {
                        ...data.body,
                    },
                });
            }
        },

        *fetchTotalSecurityGroups({ payload }, { call, put, select }) {
            const data = yield call(GenericService.query, {
                method: 'Statistics.security_groups',
            });
            if (data) {
                yield put({
                    type: 'save',
                    payload: {
                        ...data.body,
                    },
                });
            }
        },
        *fetchTotalKeypairs({ payload }, { call, put, select }) {
            const data = yield call(GenericService.query, {
                method: 'Statistics.keypairs',
            });
            if (data) {
                yield put({
                    type: 'save',
                    payload: {
                        ...data.body,
                    },
                });
            }
        },

        *fetchTotalRouters({ payload }, { call, put, select }) {
            const data = yield call(GenericService.query, {
                method: 'Statistics.routers',
            });
            if (data) {
                yield put({
                    type: 'save',
                    payload: {
                        ...data.body,
                    },
                });
            }
        },

        *fetchTotalSubnets({ payload }, { call, put, select }) {
            const data = yield call(GenericService.query, {
                method: 'Statistics.subnets',
            });
            if (data) {
                yield put({
                    type: 'save',
                    payload: {
                        ...data.body,
                    },
                });
            }
        },

        *FetchTotal({ payload }, { call, put, select }) {
            const data = yield call(GenericService.query, {
                method: 'Statistics.instances',
            });
            if (data) {
                yield put({
                    type: 'ips',
                    payload: {
                        total: data.body,
                    },
                });
            }
        },
    },

    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        },
        ips(state, action) {
            return { ...state, ...action.payload };
        },
    },
};
