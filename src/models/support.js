import * as GenericService from '@/pages/service/services/generic_service';
import { notification } from 'antd';

export default {
    namespace: 'support',
    state: {
        email: {},
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (
                    pathname.includes(
                        '/service/security/key-management-services'
                    )
                ) {
                    dispatch({
                        type: 'update',
                        payload: { method: 'Compute.list' },
                    });
                }
            });
        },
    },
    effects: {
        *sendMail({ payload }, { call, put }) {
            const data = yield call(GenericService.create, {
                data: { ...payload },
                method: '/mail/send_mail',
            });

            if (data.statusCode === 200) {
                yield put({
                    type: 'save',
                    payload: {
                        statusCode: data.statusCode,
                        ...data.body,
                    },
                });
                notification.success({
                    message: 'Email',
                    description: 'Your query has been successfully sent',
                });
            }
            yield put({
                type: 'updateLoadingState',
                payload: { id: payload.id, type: 'remove' },
            });
        },
    },

    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        },
    },
};
