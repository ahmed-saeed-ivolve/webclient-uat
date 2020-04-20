import * as SecurityGroupServices from '../pages/service/network/SecurityGroups/services/securitygroup';
import * as GenericService from '@/pages/service/services/generic_service';
import { routerRedux } from 'dva/router';
import { message, notification } from 'antd';

export default {
    namespace: 'securitygroup',
    state: {
        text: 'page work',
        list: [],
        calledBefore: false,
        selectedRows: [],
        loading: [],
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/service/network/security-groups') {
                    dispatch({
                        type: 'update',
                        payload: { method: 'Network.security_groups' },
                    });
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
                method: 'Network.delete_security_group',
            });
            if (data?.statusCode === 200) {
                yield put({
                    type: 'deleteItem',
                    payload: { payload: payload.id, deleteResult: data.body },
                });

                if (data.body.error.length === 0) {
                    notification.success({
                        message: `Security Groups`,
                        description: `${data.body.success.length} security group(s) deleted successfully`,
                    });
                } else if (data.body.success.length === 0) {
                    notification.error({
                        message: `Security Groups`,
                        description: `${data.body.error.length} security group(s) failed to delete`,
                    });
                } else {
                    notification.success({
                        message: `Security Groups`,
                        description: `${data.body.success.length} security group(s) deleted successfully`,
                    });

                    notification.error({
                        message: `Security Groups`,
                        description: `${data.body.error.length} security group(s) failed to delete`,
                    });
                }
            }
        },

        *deleteRule({ payload }, { call, put }) {
            yield put({
                type: 'updateLoadingState',
                payload: { id: payload.value, type: 'add' },
            });
            const data = yield call(GenericService.patch, {
                data: payload,
                method: 'Network.delete_security_group_rule',
            });
            if (data.statusCode === 200) {
                yield put({
                    type: 'deleteSingleRule',
                    payload: {
                        list: data.body,
                        security_group_id: payload.sgid,
                        rule_id: payload.value,
                    },
                });

                notification.success({
                    message: 'Security Group Rule',
                    description: `Security Group rule deleted `,
                });
            }
            yield put({
                type: 'updateLoadingState',
                payload: { id: payload.value, type: 'remove' },
            });
        },

        *addRule({ payload }, { call, put }) {
            const data = yield call(GenericService.patch, {
                data: payload,
                method: 'Network.create_security_group_rule',
            });
            if (data?.statusCode === 200) {
                yield put({
                    type: 'saveSingleRule',
                    payload: {
                        list: data.body,
                        security_group_id: payload.security_group_id,
                    },
                });
                notification.success({
                    message: 'Security Group Rule',
                    description: `Security Group rule added`,
                });
                yield put(routerRedux.push('/service/network/security-groups'));
            }

            yield put({
                type: 'securitygroup/update',
                payload: {
                    force: true,
                },
            });
        },

        *create({ payload }, { call, put }) {
            const data = yield call(GenericService.create, {
                data: { ...payload },
                method: 'Network.create_security_group',
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
                message.success(
                    `Security Group ${data.body.name} has been created.`
                );
                yield put(routerRedux.push('/service/network/security-groups'));
            }
        },

        *fetchSecurityGroups({ payload }, { call, put, select }) {
            const data = yield call(GenericService.create, {
                data: payload,
                method: 'Network.get_security_group_details',
            });

            if (data?.statusCode === 200) {
                yield put({ type: 'saveSingle', payload: { ...data.body } });
            }
        },

        *update({ payload }, { call, put, select }) {
            const calledBefore = yield select(
                state => state.securitygroup.calledBefore
            );
            const { force } = payload;
            if (!calledBefore || force) {
                const data = yield call(GenericService.query, {
                    method: 'Network.security_groups',
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
        updateLoadingState(state, action) {
            return {
                ...state,
                loading:
                    action.payload.type === 'add'
                        ? [...state.loading, action.payload.id]
                        : state.loading.filter(id => id !== action.payload.id),
            };
        },
        deleteItem(state, action) {
            let currentList = state.list;

            let filteredList = state.selectedRows.filter(
                item => !action.payload.deleteResult.success.includes(item)
            );
            const instancesNewList = currentList.filter(
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
        saveSingle(state, action) {
            return { ...state, list: [...state.list, { ...action.payload }] };
        },
        saveSingleRule(state, action) {
            const sgID = state.list.filter(
                item => item.id === action.payload.security_group_id
            );

            const { security_group_rules } = sgID[0];

            const newSecurityGroupRules = [
                ...security_group_rules,
                { ...action.payload.list },
            ];

            sgID[0].security_group_rules = newSecurityGroupRules;

            const newList = state.list.map(sg => {
                if (sg.id === action.payload.security_group_id) return sgID[0];
                return sg;
            });

            return {
                ...state,
                list: newList,
            };
        },

        deleteSingleRule(state, action) {
            const { security_group_id, rule_id } = action.payload;

            let sg = state.list.find(item => item.id === security_group_id);
            let idx = sg.security_group_rules.findIndex(
                item => item.id === rule_id
            );
            if (idx != -1) sg.security_group_rules.splice(idx, 1);

            let newList = state.list.map(item => {
                if (item.id === security_group_id) {
                    return sg;
                }
                return item;
            });

            return {
                ...state,
                list: [...newList],
            };
        },
    },
};
