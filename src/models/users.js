import * as GenericService from '@/pages/service/services/generic_service';
import { routerRedux } from 'dva/router';
import { notification, message } from 'antd';
import { func } from 'prop-types';

export default {
    namespace: 'users',
    state: {
        list: [],
        roleList: [],
        domainList: [],
        calledBefore: false,
        calledBeforeRoles: false,
        calledBeforeDomains: false,
        selectedRows: [],
        uri: '',
        credentials: [],
        loading: [],
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname.includes('/service/iam/users')) {
                    dispatch({
                        type: 'update',
                        payload: { method: 'IAM.users' },
                    });
                    // dispatch({
                    //   type: 'fetchDomains',
                    //   payload: { method: 'IAM.domains' },
                    // });
                }
            });
        },
    },
    effects: {
        *fetch({ payload }, { call, put }) {
            yield put({
                type: 'save',
                payload: {
                    text: 'page init',
                },
            });
        },
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
                data: payload,
                method: 'IAM.delete_user',
            });

            if (data?.statusCode === 200) {
                yield put({
                    type: 'deleteItem',
                    payload: data,
                });

                if (data.body.error.length === 0) {
                    notification.success({
                        message: `Users`,
                        description: `${data.body.success.length} user(s) deleted successfully`,
                    });
                } else if (data.body.success.length === 0) {
                    notification.error({
                        message: `Users`,
                        description: `${data.body.error.length} user(s) failed to delete`,
                    });
                } else {
                    notification.success({
                        message: `Users`,
                        description: `${data.body.success.length} user(s) deleted successfully`,
                    });

                    notification.error({
                        message: `Users`,
                        description: `${data.body.error.length} user(s) failed to delete`,
                    });
                }

                yield put({
                    type: 'selectedRows',
                    payload: data.body.success.map(id => ({ id })),
                });
            }
        },

        *create({ payload }, { call, put }) {
            const data = yield call(GenericService.create, {
                data: { ...payload },
                method: 'IAM.create_user',
            });

            if (data?.statusCode === 200) {
                const uri = data.body?.QR.uri;
                delete data.body?.QR;

                if (uri === undefined) {
                    notification.error({
                        message: `Email`,
                        description: `Failed to generate QR code for this user.`,
                    });
                }
                yield put({
                    type: 'saveSingle',
                    payload: {
                        ...data.body,
                    },
                });

                const email = data.body.email;

                const QRresponse = yield call(GenericService.create, {
                    data: { uri, email },
                    method: '/mail/sendQR',
                });

                if (QRresponse === undefined) {
                    notification.error({
                        message: `User`,
                        description: `Failed to send QR code to the user via email.Kindly disable his MFA from users table.`,
                    });
                } else {
                    notification.success({
                        message: `User`,
                        description: `User Created successfully and QR code has been emailed.`,
                    });
                }
                const new_payload = {
                    options: {
                        id: data.body.id,
                        options: {
                            multi_factor_auth_enabled: true,
                        },
                    },
                };

                yield put({
                    type: 'saveOptions',
                    payload: {
                        ...new_payload,
                    },
                });
                yield put(routerRedux.push('/service/iam/users'));
            }
        },

        *updateUser({ payload }, { call, put }) {
            const data = yield call(GenericService.create, {
                data: { ...payload },
                method: 'IAM.update_user',
            });
            if (data) {
                yield put({
                    type: 'updateSingle',
                    payload: {
                        ...data.body,
                        options: {
                            ...payload.options,
                        },
                    },
                });
                yield put({
                    type: 'drawer/closeDrawer',
                });

                message.success(`User ${data.body.name} has been updated.`);
                // yield put(routerRedux.push('/service/iam/users'));
            }
        },
        *confirmChangePassword({ payload }, { call }) {
            const data = yield call(GenericService.create, {
                data: { ...payload },
                method: 'IAM.changepassword',
            });

            if (data.body === 204) {
                notification.success({
                    message: 'Change password successfully',
                    description: `Your password has been changed and please again login`,
                });
                cpSuccessRoute();
                async function cpSuccessRoute() {
                    let promise = new Promise((resolve, reject) => {
                        setTimeout(() => resolve('/login'), 5000);
                    });

                    let loginRoute = await promise;
                    let loginRoute1 = window.location.assign(loginRoute);

                    return loginRoute1;
                }
            } else {
                notification.error({
                    message: 'Change password failed',
                    description: `Invalid current password`,
                });
            }
        },

        *getCredentials({ payload }, { call, put }) {
            const data = yield call(GenericService.create, {
                data: { ...payload },
                method: 'IAM.get_credentials',
            });
            if (data?.statusCode === 200) {
                yield put({
                    type: 'saveCredentials',
                    payload: {
                        uri: data.body.uri,
                        credentials: data.body.credentials,
                    },
                });
            }
        },
        *refreshQR({ payload }, { call, put }) {
            const data = yield call(GenericService.create, {
                data: { ...payload },
                method: 'IAM.refresh_mfa_qr',
            });
            if (data?.statusCode === 200) {
                yield put({
                    type: 'saveCredentials',
                    payload: {
                        uri: data.body.uri,
                        credentials: data.body.credentials,
                    },
                });
                notification.success({
                    message: 'QR Code',
                    description: `QR code has been refreshed for the user ${payload.user_name}`,
                });
            }
        },

        *mfa_enable_or_disable({ payload }, { call, put }) {
            yield put({
                type: 'updateLoadingState',
                payload: { id: payload.user_id, type: 'add' },
            });
            if (payload.action === 'enable') {
                const data = yield call(GenericService.create, {
                    data: { ...payload },
                    method: payload.method,
                });

                if (
                    data?.statusCode === 200 &&
                    data?.body.hasOwnProperty('uri')
                ) {
                    yield put({
                        type: 'saveUri',
                        payload: {
                            uri: data.body.uri,
                        },
                    });

                    notification.success({
                        message: 'QR generated',
                        description: `QR code has been generated for the user ${payload.user_name}`,
                    });
                } else if (data?.body.hasOwnProperty('user')) {
                    yield put({
                        type: 'saveOptions',
                        payload: {
                            options: data.body.user,
                        },
                    });

                    notification.success({
                        message: 'MFA Enabled',
                        description: `MFA has been enabed for the user ${payload.user_name}`,
                    });
                }
            } else {
                let method = payload.method;
                delete payload['method'];
                const data = yield call(GenericService.create, {
                    data: { ...payload },
                    method,
                });
                if (data?.body === 'Credentials deleted') {
                    notification.success({
                        message: 'QR Deleted',
                        description: `QR code has been deleted for the user ${payload.user_name}`,
                    });
                } else if (data?.body.hasOwnProperty('user')) {
                    yield put({
                        type: 'saveOptions',
                        payload: {
                            options: data.body.user,
                        },
                    });

                    notification.success({
                        message: 'MFA Disabled',
                        description: `MFA has been disabed for the user ${payload.user_name}`,
                    });
                }
            }
            yield put({
                type: 'updateLoadingState',
                payload: { id: payload.user_id, type: 'remove' },
            });
        },

        *fetchRoles({ payload }, { call, put, select }) {
            const calledBeforeRoles = yield select(
                state => state.users.calledBeforeRoles
            );
            if (!calledBeforeRoles || payload?.force) {
                const data = yield call(GenericService.query, {
                    method: 'IAM.roles',
                });

                if (data) {
                    yield put({
                        type: 'saveRoles',
                        payload: {
                            roleList: data.body,
                            calledBeforeRoles: true,
                        },
                    });
                }
            }
        },

        *fetchDomains({ payload }, { call, put, select }) {
            const calledBeforeDomains = yield select(
                state => state.users.calledBeforeDomains
            );
            if (!calledBeforeDomains) {
                const data = yield call(GenericService.query, {
                    method: 'IAM.domains',
                });

                if (data) {
                    yield put({
                        type: 'saveDomains',
                        payload: {
                            domainList: data.body,
                            calledBeforeDomains: true,
                        },
                    });
                }
            }
        },

        *update({ payload }, { call, put, select }) {
            const calledBefore = yield select(
                state => state.users.calledBefore
            );
            if (!calledBefore || payload?.force) {
                const data = yield call(GenericService.query, {
                    method: 'IAM.users',
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
    },
    reducers: {
        saveOptions(state, action) {
            const list = state.list.map(item => {
                if (item.id === action.payload.options.id) {
                    return {
                        ...item,
                        ...action.payload.options,
                    };
                } else {
                    return item;
                }
            });

            return { ...state, list };
        },
        deleteItem(state, action) {
            const successList = action.payload.body.success;

            const filteredList = state.list.filter(
                items => !successList.includes(items.id)
            );
            return { ...state, list: filteredList };
        },

        selectedRows(state, action) {
            const { selectedRows } = state;
            const { payload } = action;

            const newSelectedKeys = payload.reduce((acc, record) => {
                if (acc.includes(record.id)) {
                    // return { ...state }
                    // return { ...state, selectedRows: state.selectedRows.filter(id => id !== action.payload.id) }
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

        saveRoles(state, action) {
            return { ...state, ...action.payload };
        },

        saveDomains(state, action) {
            return { ...state, ...action.payload };
        },

        updateSingle(state, action) {
            var filteredList = state.list.map(item =>
                item.id === action.payload.id ? action.payload : item
            );
            return { ...state, list: filteredList };
        },

        saveSingle(state, action) {
            return { ...state, list: [...state.list, { ...action.payload }] };
        },
        saveCredentials(state, action) {
            const { credentials, uri } = action.payload;
            return { ...state, credentials, uri };
        },
        saveUri(state, action) {
            return { ...state, uri: action.payload.uri };
        },
        updateLoadingState(state, action) {
            return {
                ...state,
                loading:
                    action.payload.type === 'add'
                        ? [
                              ...state.loading,
                              action.payload.id,
                              action.payload.switchChange,
                          ]
                        : state.loading.filter(id => id !== action.payload.id),
            };
        },
    },
};
