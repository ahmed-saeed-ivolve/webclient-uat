import { queryNotices } from '@/services/user';
import { queryMonthlySpend, querySpendByService } from '@/services/globalCloud';
import * as GenericService from '../pages/service/services/generic_service';

const PricingModel = {
    namespace: 'pricing',
    state: {},
    effects: {},
    reducers: {
        genericReducer(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
    subscriptions: {},
};
export default PricingModel;
