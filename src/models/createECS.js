import * as GenericService from '@/pages/service/services/generic_service';
import { routerRedux } from 'dva/router';

export const initialFormData = {
    First: {
        name: {
            value: '',
            name: 'name',
        },
        availability_zone: {
            value: '',
            name: 'availability_zone',
        },
        region: {
            value: '',
            name: 'region',
        },
        count: {
            value: 1,
            name: 'count',
        },
    },
    Second: {
        billing_mode: {
            value: 'OD',
            name: 'billing_mode',
        },
        pay_term: {
            value: 'NU',
            name: 'pay_term',
        },
        duration: {
            value: '1Y',
            name: 'duration',
        },
        image_id: {
            value: '',
            name: 'image_id',
        },
        flavor_id: {
            value: '',
            name: 'flavor_id',
        },

        volume_id: {
            value: '',
            name: 'volume_id',
        },

        disk_size: {
            value: 50,
            name: 'disk_size',
        },
    },
    Third: {
        networks: {
            value: [],
            name: 'networks',
        },
    },
    Fourth: {
        security_groups: {
            value: [],
            name: 'security_groups',
        },
        key_name: {
            value: '',
            name: 'key_name',
        },
    },
    Fifth: {
        metadata: {},
    },
};

export default {
    namespace: 'createECS',
    state: {
        estimated_price: 0,
        marketplace: false,
        billingmode: 'on_demand',
        metaData: [],
        count: 0,
        formsData: {
            ...initialFormData,
        },
    },

    effects: {
        *resetMetaData({ payload }, { call, put }) {
            yield put({
                type: 'resetMetadata',
                payload: payload,
            });
        },
        *deleteMetaData({ payload }, { call, put }) {
            yield put({
                type: 'deleteMetadata',
                payload: payload,
            });
        },
        *setMetaData({ payload }, { call, put }) {
            yield put({
                type: 'saveMetadata',
                payload: payload,
            });
        },
        *chanegBillingMode({ payload }, { call, put }) {
            yield put({
                type: 'saveBillingMode',
                payload: payload,
            });
        },

        *quote({ payload }, { call, put }) {
            const data = {
                resources: [
                    {
                        volume: '1',
                        service: 'instance',
                        desc: {
                            project_id: '71e42626ba544a77a23942feb53654bc',
                            user_id: 'ff664fd25dc3467dab14828bc6c3bffa',
                            flavor_id: `${payload.flavor_id}`,
                        },
                    },
                ],
            };
            let quote = yield call(GenericService.query, {
                method: payload.method,
                data,
            });
        },
    },
    reducers: {
        updateFormData(state, { payload }) {
            if (payload.marketplace === true) {
                return {
                    ...state,
                    formsData: {
                        ...state.formsData,
                        ...payload.image_id,
                    },
                    marketplace: payload.marketplace,
                };
            } else {
                return {
                    ...state,
                    formsData: {
                        ...state.formsData,
                        [payload.formIndex]: {
                            ...state.formsData[payload.formIndex],
                            ...payload.value,
                        },
                    },
                };
            }
        },

        saveMetadata(state, { payload }) {
            return {
                ...state,
                metaData: [...state.metaData, payload.new_data],
                count: payload.counter,
            };
        },
        deleteMetadata(state, { payload }) {
            return {
                ...state,
                metaData: payload,
            };
        },
        resetMetadata(state, { payload }) {
            return {
                ...state,
                metaData: payload.reset_metastate,
                count: payload.counter,
            };
        },
        saveBillingMode(state, { payload }) {
            return {
                ...state,
                billingmode: payload,
            };
        },
        genericReducer(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
        save(state, action) {
            return { ...state, ...action.payload };
        },
        resetFormsData(state, { payload }) {
            return {
                ...state,
                formsData: {
                    ...initialFormData,
                },
            };
        },
    },
};
