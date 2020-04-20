import * as GenericService from '@/pages/service/services/generic_service';

export default {
    namespace: 'report',
    state: {
        usageReport: [],
    },
    effects: {
        *usageReportForInstances({ payload }, { call, put }) {
            const { from, to } = payload;
            let response = null;

            try {
                response = yield call(GenericService.query, {
                    method: '/ecs',
                    config: 'usage-report',
                    querystring: {
                        start: from,
                        end: to,
                    },
                });
            } catch (ex) {}

            try {
                if (response.status === 'ok') {
                    yield put({
                        type: 'putUsageReport',
                        payload: response.payload,
                    });
                }
            } catch (ex) {}
        },
    },
    reducers: {
        putUsageReport(state, action) {
            return { ...state, usageReport: action.payload };
        },
    },
};
