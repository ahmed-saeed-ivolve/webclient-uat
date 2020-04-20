import * as IMSServices from '../pages/service/compute/ImageManagementServices/services/ims';
import * as GenericService from '@/pages/service/services/generic_service';
import { routerRedux } from 'dva/router';
import { notification } from 'antd';

export default {
    namespace: 'ims',
    state: {
        text: 'page work',
        list: [],
        calledBefore: false,
        selectedRows: [],
        currentImage: {},
        selectedInstance: null,
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (
                    pathname === '/service/compute/image-management-services' ||
                    pathname ===
                        '/service/storage/elastic-volume-services/create'
                ) {
                    dispatch({
                        type: 'fetchList',
                        payload: { method: 'Image.list' },
                    });
                }
            });
        },
    },
    effects: {
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
                method: 'Image.delete',
            });
            if (data?.statusCode === 200) {
                yield put({
                    type: 'deleteItem',
                    payload: payload,
                });
            }
        },

        // create: It doesn't work
        *create({ payload }, { call, put }) {
            const data = yield call(IMSServices.create, {
                data: { ...payload },
            });
            if (data) {
                yield put({
                    type: saveSingle,
                    payload: {
                        ...data.body,
                    },
                });
                yield put(
                    routerRedux.push(
                        '/service/compute/image-management-services'
                    )
                );
            }
        },

        *updateImage({ payload }, { call, put, select }) {
            const responseData = yield call(GenericService.patch, {
                data: payload,
                method: 'Image.update_image',
            });
            if (responseData) {
                const imsList = yield select(state => state.ims);
                if (responseData.statusCode === 200) {
                    notification.success({
                        message: `Update Image`,
                        description: `${responseData.body.name} image has been updated successfully`,
                    });
                }
                yield put({
                    type: 'updateSingle',
                    payload: {
                        ...responseData.body,
                    },
                });
            }
        },
        *fetchList({ payload }, { call, put, select }) {
            const calledBefore = yield select(state => state.ims.calledBefore);
            const force = payload?.force;
            if (!calledBefore || force) {
                const data = yield call(GenericService.query, {
                    method: 'Image.list',
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

        *showCurrentImage({ payload }, { call, select, put }) {
            const imsdetail = yield select(state => state);
            imsdetail.filter(items => items.id === payload);
            yield put({
                type: 'currentImage',
                payload: imsdetail,
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
        currentImage(state, action) {
            return { ...state, currentImage: action.payload };
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
        updateSingle(state, action) {
            const stateList = state.list.filter(function(obj) {
                return obj.id !== action.payload.id;
            });
            return { ...state, list: [...stateList, { ...action.payload }] };
        },
    },
};
