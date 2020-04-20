import * as EVSServices from '../pages/service/storage/ElasticVolumeServices/services/evs';
import * as GenericService from '@/pages/service/services/generic_service';
import { routerRedux } from 'dva/router';
import { message, notification } from 'antd';

export default {
    namespace: 'evs',
    state: {
        list: [],
        volumeTypes: [],
        creationType: {
            type: 1,
            payload: {},
        },
        calledBefore: false,
        calledBeforeVolumeTypes: false,
        selectedRows: [],
        estimated_price: 0,
        loading: [],
        showmodal: false,
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname.includes('/service/storage')) {
                    dispatch({
                        type: 'update',
                        payload: { method: 'Volume.list' },
                    });
                } else if (pathname.includes('/service/settings')) {
                    dispatch({
                        type: 'fetchVolumesForPricing',
                    });
                }
            });
        },
    },

    effects: {
        *fetchVolumesForPricing({ payload }, { call, put }) {
            const data = yield call(GenericService.query, {
                method: '/list_volumes',
                config: 'pricing',
            });
            yield put.resolve({
                type: 'saveListFromDb',
                payload: data,
            });
        },

        *createPricingVolume({ payload }, { call, put }) {
            const data = yield call(GenericService.create, {
                data: payload,
                method: '/create_volume',
                config: 'pricing',
            });
            if (data?.status === 200) {
                yield put.resolve({
                    type: 'saveSingleDb',
                    payload: {
                        ...data.data.body.data,
                    },
                });
                notification.success({
                    message: ` Create evs`,
                    description: 'evs created successfully',
                });
                yield put(routerRedux.push('/service/settings/volumes'));
            } else {
                notification.error({
                    message: `failed to create evs`,
                });
            }
        },

        *createVolumeFromVolume({ payload }, { call, put }) {
            yield put({
                type: 'save',
                payload: {
                    creationType: {
                        type: 1,
                        payload: {},
                    },
                },
            });
        },

        *createVolumeFromImage({ payload }, { call, put }) {
            yield put({
                type: 'save',
                payload: {
                    creationType: {
                        type: 2,
                        payload: payload,
                    },
                },
            });
        },

        *createVolumeFromSnapshot({ payload }, { call, put }) {
            yield put({
                type: 'save',
                payload: {
                    creationType: {
                        type: 3,
                        payload: payload,
                    },
                },
            });
        },

        *createVolumeFromVolume({ payload }, { call, put }) {
            yield put({
                type: 'save',
                payload: {
                    creationType: {
                        type: 1,
                        payload: null,
                    },
                },
            });
        },

        *fetchVolumes({ payload }, { call, put, select }) {
            const data = yield call(GenericService.create, {
                data: payload,
                method: 'Volume.get',
            });

            if (data?.statusCode === 200) {
                yield put({ type: 'saveSingle', payload: { ...data.body } });
            }
        },

        *delete({ payload }, { call, put }) {
            yield put({
                type: 'save',
                payload: {
                    list: [],
                },
            });
        },
        *deleteResources({ payload }, { call, put, select }) {
            const data = yield call(GenericService.patch, {
                data: payload,
                method: 'Volume.delete',
            });

            if (data?.statusCode === 200) {
                const state = yield select();
                yield put({
                    type: 'deleteItem',
                    payload: { payload: payload.id, deleteResult: data.body },
                });

                if (data.body.success.length != 0) {
                    notification.success({
                        message: `Volume`,
                        description: `${data.body.success.length} Volume(s) deleted successfully`,
                    });
                    if (data.body.error.length != 0) {
                        notification.error({
                            message: `Volume`,
                            description: `${data.body.error.length} Volume(s) may be in use or a snapshot of volume(s) exist.`,
                        });
                    }
                } else if (data.body.error.length != 0) {
                    notification.error({
                        message: `Volume`,
                        description: `${data.body.error.length} Volume(s) may be in use or a snapshot of volume(s) exist.`,
                    });

                    if (data.body.success.length != 0) {
                        notification.success({
                            message: `Volume`,
                            description: `${data.body.success.length} Volume(s) deleted successfully`,
                        });
                    }
                }
            }
        },
        *create({ payload }, { call, put }) {
            const data = yield call(GenericService.create, {
                data: { ...payload },
                method: 'Volume.create',
            });
            if (data) {
                yield put({
                    type: 'saveSingle',
                    payload: {
                        ...data.body,
                    },
                });
                yield put({
                    type: 'drawer/closeDrawer',
                });

                if (
                    !window.location.href.includes(
                        '/service/compute/elastic-cloud-services'
                    )
                ) {
                    yield put(
                        routerRedux.push(
                            '/service/storage/elastic-volume-services'
                        )
                    );
                    message.success(
                        `Volume ${data.body.name} has been created.`
                    );
                }
            }
        },

        *resize({ payload }, { call, put }) {
            const data = yield call(GenericService.create, {
                data: { ...payload },
                method: 'Volume.resize_volume',
            });

            if (data !== undefined) {
                if (payload.size !== data.body.size) {
                    message.error(`Insufficient space .`);
                } else if (payload.size === data.body.size) {
                    yield put({
                        type: 'saveSingleAfterResize',
                        payload: {
                            ...data.body,
                        },
                    });

                    message.success(
                        `Volume ${
                            data.body.name === ''
                                ? data.body.id
                                : data.body.name
                                ? data.body.name
                                : payload.volume_id
                        } has been resized.`
                    );
                }
            }
            yield put({
                type: 'drawer/closeDrawer',
            });
        },

        *update({ payload }, { call, put, select }) {
            const calledBefore = yield select(state => state.evs.calledBefore);

            if (!calledBefore || payload?.force === true) {
                const data = yield call(GenericService.query, {
                    method: 'Volume.list',
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
                method: '/update_evs',
                config: 'pricing',
            });
            if (data?.status === 200) {
                yield put.resolve({
                    type: 'fetchVolumesForPricing',
                });

                notification.success({
                    message: 'Evs Update',
                    description: 'successfully updated evs',
                });
            }
            yield put.resolve({
                type: 'stopLoading',
            });
        },
        *singleVolume({ payload }, { call, put, select }) {
            yield put({
                type: 'updateLoadingState',
                payload: { id: payload.id, type: 'add' },
            });

            yield put.resolve({
                type: 'updateSingle',
            });
        },

        *volumeTypes({ payload }, { call, put, select }) {
            const calledBeforeVolumeTypes = yield select(
                state => state.evs.calledBeforeVolumeTypes
            );

            if (!calledBeforeVolumeTypes || payload?.force === true) {
                const data = yield call(GenericService.query, {
                    method: 'Volume.types',
                });
                if (data) {
                    yield put({
                        type: 'saveTypes',
                        payload: {
                            list: data.body,
                            calledBeforeVolumeTypes: true,
                        },
                    });
                }
            }
        },

        *forBootable({ payload }, { call, put, select }) {
            const data = yield call(GenericService.create, {
                data: { ...payload },
                method: 'Volume.set_volume_bootable',
            });
            if (data) {
                yield put({
                    type: 'saveAfterBootable',
                    payload: data.body,
                });
            }
        },

        *quote({ payload }, { call, put }) {
            const data = {
                resources: [
                    {
                        volume: payload.volume,
                        service: 'volume.size',
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
                    estimated_price: quote.body,
                },
            });
        },
    },
    reducers: {
        saveListFromDb(state, action) {
            return {
                ...state,
                listDb: action.payload,
            };
        },

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

        saveAfterBootable(state, action) {
            const changeInstanceStatus = state.list.map(items => {
                if (items.id === action.payload.id) {
                    return action.payload;
                }
                return items;
            });

            return { ...state, list: [...changeInstanceStatus] };
        },

        saveSingle(state, action) {
            return { ...state, list: [...state.list, { ...action.payload }] };
        },

        saveSingleDb(state, action) {
            return {
                ...state,
                listDb: [...state.listDb, { ...action.payload }],
            };
        },
        saveSingleAfterResize(state, action) {
            var filteredList = state.list.map(item =>
                item.id === action.payload.id ? action.payload : item
            );
            return { ...state, list: filteredList };
        },
        saveTypes(state, action) {
            return { ...state, volumeTypes: action.payload.list };
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
    },
};
