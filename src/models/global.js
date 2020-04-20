import { queryNotices } from '@/services/user';
import {
    queryAvailabilityZone,
    queryMonthlySpend,
} from '@/services/globalCloud';
import * as GenericService from '../pages/service/services/generic_service';

const GlobalModel = {
    namespace: 'global',
    state: {
        collapsed: false,
        notices: [],
        availabilityZones: [],
        regions: [],
        flavors: [],
        images: [],
        networks: [],
        keypair: [],
        floatingips: [],
        calledBeforeAvailabilityZone: false,
        calledBeforeDbmsMetadata: false,

        spends: [],
        spendByService: [],
        currentMonthSpendByService: [],
        hashmapRateMappings: [],
        ratedDataFrames: [],
        currentMonthSpends: [],
        totalCurrentSpend: 0,
    },

    effects: {
        *fetchCreateVMDependencies({ payload }, { call, put, select }) {
            yield put.resolve({
                type: 'flavor/update',
            });

            yield put.resolve({
                type: 'fetchAvailabilityZone',
            });

            yield put.resolve({
                type: 'fetchRegions',
            });

            yield put.resolve({
                type: 'vpc/update',
                payload: { method: 'Network.networks' },
            });

            yield put.resolve({
                type: 'ims/fetchList',
            });

            yield put.resolve({
                type: 'keypair/update',
                payload: { method: 'Compute.list_keypairs' },
            });

            yield put.resolve({
                type: 'securitygroup/update',
                payload: {
                    force: true,
                },
            });

            yield put.resolve({
                type: 'floatingip/update',
                payload: { method: 'Network.ips' },
            });
        },

        *deleteEachResource({ payload }, { call, put, select }) {
            const selectedSubService = yield select(
                state => state.serviceLayout.selectedSubService
            );

            var selectedRows = yield select(
                state => state[selectedSubService.modelName].selectedRows
            );

            yield put.resolve({
                type: `${selectedSubService.modelName}/deleteResources`,
                payload: { id: selectedRows },
            });
        },

        *fetchAvailabilityZone({ payload }, { call, put, select }) {
            const calledBeforeAvailabilityZone = yield select(
                state => state.global.calledBeforeAvailabilityZone
            );

            if (!calledBeforeAvailabilityZone || payload?.force === true) {
                const response = yield call(GenericService.query, {
                    method: 'Compute.availability_zones',
                });
                if (response) {
                    yield put({
                        type: 'saveAvailablityZone',
                        payload: {
                            availabilityZones: response?.body
                                ? response?.body
                                : [],
                            calledBeforeAvailabilityZone: true,
                        },
                    });
                }
            }
        },

        *fetchDbmsMetadata({ payload }, { call, put, select }) {
            const calledBeforeDbmsMetadata = yield select(
                state => state.global.calledBeforeDbmsMetadata
            );

            if (!calledBeforeDbmsMetadata || payload?.force === true) {
                const response = yield call(GenericService.query, {
                    method: 'Compute.metadata_dbms',
                });
                if (response) {
                    yield put({
                        type: 'saveDbmsMetadata',
                        payload: {
                            dbmsMetadata: response?.body ? response?.body : [],
                            calledBeforeDbmsMetadata: true,
                        },
                    });
                }
            }
        },
        *fetchSpends({ payload }, { call, put }) {
            const data = yield call(GenericService.query, {
                method: 'Billing.getMonthlySpendByService',
                data: payload,
            });
            yield put({
                type: 'genericReducer',
                payload: {
                    spends: data.body,
                },
            });
        },
        *fetchSpendByServiceFromTo({ payload }, { call, put }) {
            const data = yield call(GenericService.query, {
                method: 'Billing.getSpendByService',
                data: payload,
            });
            yield put({
                type: 'genericReducer',
                payload: {
                    spendByService: data.body,
                },
            });
        },
        *fetchRateMappings({ payload }, { call, put }) {
            const data = yield call(GenericService.query, {
                method: 'Billing.getRatingMappings',
                data: payload,
            });
            yield put({
                type: 'genericReducer',
                payload: {
                    hashmapRateMappings: data.body,
                },
            });
        },

        *fetchRatedDataFrames({ payload }, { call, put }) {
            const data = yield call(GenericService.query, {
                method: 'Billing.getRatedDataframes',
                data: payload,
            });
            yield put({
                type: 'genericReducer',
                payload: {
                    ratedDataFrames: data.body,
                },
            });
        },
        *fetchCurrentMonthSpends({ payload }, { call, put }) {
            const data = yield call(GenericService.query, {
                method: 'Billing.current_month_summary',
                data: payload,
            });
            yield put({
                type: 'genericReducer',
                payload: {
                    currentMonthSpends: data.body,
                },
            });
        },

        *fetchCurrentTotalSpend({ payload }, { call, put }) {
            const data = yield call(GenericService.query, {
                method: 'Billing.get_total',
            });
            yield put({
                type: 'genericReducer',
                payload: {
                    totalCurrentSpend: data.body,
                },
            });
        },
        *fetchRegions({ payload }, { call, put, select }) {
            payload = { method: 'Identity.regions' };
            const data = yield call(GenericService.query, payload);
            yield put({
                type: 'genericReducer',
                payload: {
                    regions: data.body,
                },
            });
        },
        *fetchNetwork({ payload }, { call, put, select }) {
            payload = { method: 'Network.networks' };
            const data = yield call(GenericService.query, payload);
            yield put({
                type: 'genericReducer',
                payload: {
                    networks: data.body,
                },
            });
        },
        *fetchFlavors({ payload }, { call, put, select }) {
            payload = { method: 'Compute.list_flavors' };
            const data = yield call(GenericService.query, payload);
            yield put({
                type: 'genericReducer',
                payload: {
                    flavors: data.body,
                },
            });
        },
        *fetchImages({ payload }, { call, put, select }) {
            payload = { method: 'Image.list' };
            const data = yield call(GenericService.query, payload);
            yield put({
                type: 'genericReducer',
                payload: {
                    images: data.body,
                },
            });
        },
        *fetchFloatingips({ payload }, { call, put, select }) {
            payload = { method: 'Network.ips' };
            const data = yield call(GenericService.query, payload);
            yield put({
                type: 'genericReducer',
                payload: {
                    floatingips: data.body,
                },
            });
        },
        *fetchNotices(_, { call, put, select }) {
            const data = yield call(queryNotices);
            yield put({
                type: 'saveNotices',
                payload: data,
            });
            const unreadCount = yield select(
                state => state.global.notices.filter(item => !item.read).length
            );
            yield put({
                type: 'user/changeNotifyCount',
                payload: {
                    totalCount: data.length,
                    unreadCount,
                },
            });
        },

        *clearNotices({ payload }, { put, select }) {
            yield put({
                type: 'saveClearedNotices',
                payload,
            });
            const count = yield select(state => state.global.notices.length);
            const unreadCount = yield select(
                state => state.global.notices.filter(item => !item.read).length
            );
            yield put({
                type: 'user/changeNotifyCount',
                payload: {
                    totalCount: count,
                    unreadCount,
                },
            });
        },

        *changeNoticeReadState({ payload }, { put, select }) {
            const notices = yield select(state =>
                state.global.notices.map(item => {
                    const notice = { ...item };

                    if (notice.id === payload) {
                        notice.read = true;
                    }

                    return notice;
                })
            );
            yield put({
                type: 'saveNotices',
                payload: notices,
            });
            yield put({
                type: 'user/changeNotifyCount',
                payload: {
                    totalCount: notices.length,
                    unreadCount: notices.filter(item => !item.read).length,
                },
            });
        },
    },

    reducers: {
        saveAvailablityZone(state, { payload }) {
            return {
                ...state,
                calledBeforeAvailabilityZone:
                    payload.calledBeforeAvailabilityZone,
                availabilityZones: payload.availabilityZones,
            };
        },
        saveDbmsMetadata(state, { payload }) {
            return {
                ...state,
                calledBeforeDbmsMetadata: payload.calledBeforeDbmsMetadata,
                dbmsMetadata: payload.dbmsMetadata,
            };
        },
        saveRegions(state, { payload }) {
            return {
                ...state,
                regions: payload.regions,
            };
        },
        genericReducer(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
        changeLayoutCollapsed(
            state = {
                notices: [],
                collapsed: true,
            },
            { payload }
        ) {
            return { ...state, collapsed: payload };
        },

        saveNotices(state, { payload }) {
            return {
                collapsed: false,
                ...state,
                notices: payload,
            };
        },

        saveTotal(state, { payload }) {
            return {
                ...state,
                flavor: payload?.flavor ? payload.flavor : state.flavor,
                volume: payload?.volume ? payload.volume : state.volume,
            };
        },

        saveClearedNotices(
            state = {
                notices: [],
                collapsed: true,
            },
            { payload }
        ) {
            return {
                collapsed: false,
                ...state,
                notices: state.notices.filter(item => item.type !== payload),
            };
        },
    },

    subscriptions: {
        setup({ history }) {
            history.listen(({ pathname, search }) => {
                if (typeof window.ga !== 'undefined') {
                    window.ga('send', 'pageview', pathname + search);
                }
            });
        },
    },
};
export default GlobalModel;
