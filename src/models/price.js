import { queryNotices } from '@/services/user';
import {
    queryAvailabilityZone,
    queryMonthlySpend,
} from '@/services/globalCloud';
import * as GenericService from '../pages/service/services/generic_service';

const GlobalModel = {
    namespace: 'price',
    state: {
        flavor: 0,
        volume: 0,
    },

    effects: {
        *pricingService({ payload }, { call, put }) {
            const {
                name,
                updatedDuration,
                updatedPayterm,
                updatedBillingmode,
            } = payload.flavor;

            const response = yield call(GenericService.query, {
                method: '/get',
                config: 'pricing',
                url: '/flavor',
                querystring: payload.flavor,
            });

            yield put({
                type: 'saveTotal',
                payload: response?.result,
            });
        },

        *pricingServiceVolume({ payload }, { call, put }) {
            const { evs, updatedvalue_disk } = payload.volume;
            const response = yield call(GenericService.query, {
                method: '/get',
                url: '/volume',
                config: 'pricing',
                querystring: payload.volume,
            });
            yield put({
                type: 'saveTotal',
                payload: {
                    volume: response?.total !== null ? response.total : 0,
                },
            });
        },
    },

    reducers: {
        saveTotal(state, { payload }) {
            return {
                ...state,
                flavor: payload?.flavor ? payload.flavor.price : state.flavor,
                volume: payload?.volume ? payload.volume : state.volume,
            };
        },

        clearPricingFlavor(state, { payload }) {
            return {
                ...state,
                flavor: 0,
            };
        },
        clearPricingVolume(state, { payload }) {
            return {
                ...state,
                volume: 0,
            };
        },
    },
};
export default GlobalModel;
