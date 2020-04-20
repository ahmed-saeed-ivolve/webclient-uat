import * as GenericService from '@/pages/service/services/generic_service';
import { routerRedux } from 'dva/router';

export default {
    namespace: 'drawer',
    state: {
        componentPath: null,
        show: false,
        mountedData: {},
    },

    reducers: {
        showDrawer(state, action) {
            return {
                ...state,
                show: true,
                componentPath: action.payload.componentPath,
                mountedData: { ...action.payload.mountedData },
            };
        },
        closeDrawer(state, action) {
            return {
                ...state,
                show: false,
                componentPath: null,
                mountedData: {},
            };
        },
    },
};
