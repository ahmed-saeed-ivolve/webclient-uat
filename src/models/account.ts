import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import * as GenericService from '@/pages/service/services/generic_service';
import { routerRedux } from 'dva/router';
import {
    fakeAccountLogin,
    getFakeCaptcha,
    openstackLogin,
    changeProject,
    mfaPasscodeRequest,
    logout,
} from '../pages/user/account/service';
import {
    getPageQuery,
    setDetasadAuthority,
    unset,
} from '../pages/user/account/utils/utils';
import { connect } from 'dva';

export interface StateType {
    status?: 'ok' | 'error';
    type?: string;
    currentAuthority?: 'unscoped' | 'projectScope';
}

export type Effect = (
    action: AnyAction,
    effects: EffectsCommandMap & {
        select: <T>(func: (state: StateType) => T) => T;
    }
) => void;

export interface ModelType {
    namespace: string;
    state: StateType;
    effects: {
        login: Effect;
        loginOpenstack: Effect;
        logoutOpenstack: Effect;
        loginAfterMfa: Effect;
        mfaPasscodeAuth: Effect;
        getCaptcha: Effect;
        logout: Effect;
    };
    reducers: {
        changeLoginStatus: Reducer<StateType>;
        logoutUser: Reducer<StateType>;
    };
}

const Model: ModelType = {
    namespace: 'userAccount',

    state: {
        status: undefined,
        type: '',
        mfa_data: {},
    },

    effects: {
        *logoutOpenstack({ payload }, { call, put }) {
            let response = null;
            try {
                response = yield call(logout);
            } catch (error) {}

            localStorage.clear();

            window.location.assign('/login');
        },

        *loginOpenstack({ payload }, { call, put }) {
            const response = yield call(openstackLogin, payload);

            if (response?.hasOwnProperty('Openstack-Auth-Reciept')) {
                yield put(routerRedux.replace('/mfa-login'));
                yield put({
                    type: 'save',
                    payload: response,
                });
            } else if (response) {
                yield put.resolve({
                    type: 'changeLoginStatus',

                    payload: {
                        status: 'success',
                        type: 'account',
                        currentAuthority: response.tokenMetadata.scope,
                        token: response,
                    },
                });

                yield put(routerRedux.replace('/'));
            }
        },
        *mfaPasscodeAuth({ payload }, { call, put }) {
            const response = yield call(mfaPasscodeRequest, payload);

            if (response) {
                yield put.resolve({
                    type: 'changeLoginStatus',

                    payload: {
                        status: 'success',
                        type: 'account',
                        currentAuthority: response.tokenMetadata.scope,
                        token: response,
                    },
                });

                yield put(routerRedux.replace('/'));
            }
        },
        *projectChange({ payload }, { call, put }) {
            const response = yield call(changeProject, payload);
            if (response) {
                yield put.resolve({
                    type: 'changeLoginStatus',
                    payload: {
                        status: 'success',
                        type: 'account',
                        currentAuthority: response.tokenMetadata.scope,
                        token: response,
                    },
                });
            }
        },

        *login({ payload }, { call, put }) {
            const response = yield call(fakeAccountLogin, payload);
            yield put({
                type: 'changeLoginStatus',
                payload: response,
            });
            if (response.status === 'ok') {
                const urlParams = new URL(window.location.href);
                const params = getPageQuery();
                let { redirect } = params as { redirect: string };
                if (redirect) {
                    const redirectUrlParams = new URL(redirect);
                    if (redirectUrlParams.origin === urlParams.origin) {
                        redirect = redirect.substr(urlParams.origin.length);
                        if (redirect.match(/^\/.*#/)) {
                            redirect = redirect.substr(
                                redirect.indexOf('#') + 1
                            );
                        }
                    } else {
                        window.location.href = redirect;
                        return;
                    }
                }
                yield put(routerRedux.replace(redirect || '/'));
            }
        },

        *logout({ payload }, { call, put }) {
            const response = yield call(logout, payload);

            if (response) {
                yield put({
                    type: 'logoutStatus',
                    payload: {
                        status: 'successfull',
                    },
                });
            }
        },

        *getCaptcha({ payload }, { call }) {
            yield call(getFakeCaptcha, payload);
        },
    },

    reducers: {
        changeLoginStatus(state, { payload }) {
            if (payload.status === 'success')
                setDetasadAuthority(payload.currentAuthority, payload.token);
            return {
                ...state,
                status: payload.status,
                type: payload.type,
            };
        },
        logoutUser() {
            unset();
            return {
                status: undefined,
                type: '',
            };
        },

        save(state, { payload }) {
            return { ...state, mfa_data: payload };
        },
    },
};

export default Model;
