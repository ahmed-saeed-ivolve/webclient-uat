import * as GenericService from '@/pages/service/services/generic_service';
import { routerRedux } from 'dva/router';
import { notification, message } from 'antd';

export default {
    namespace: 'groups',
    state: {
        list: [],
        calledBefore: false,
        selectedRows: [],
        currentGroup: null,
        loading: [],
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/service/iam/groups/show-group') {
                    if (query.id) {
                        dispatch({
                            type: 'updateSelectedGroup',
                            payload: {
                                query,
                            },
                        });
                    } else {
                        window.location.href = '/service/iam/groups';
                    }
                } else if (pathname === '/service/iam/groups') {
                    dispatch({
                        type: 'update',
                        payload: {
                            force: false,
                        },
                    });
                }
            });
        },
    },
    effects: {
        *updateSelectedGroup({ payload }, { call, put, select }) {
            const queries = payload.query;
            const groupId = queries?.id;

            let groupsList = yield select(state => state.groups.list);
            let groupsListLength = groupsList.length;
            let currentGroup = groupsList.find(group => group.id === groupId);

            if (groupsListLength === 0 && !currentGroup) {
                yield put.resolve({
                    type: 'update',
                    payload: {
                        force: true,
                    },
                });

                groupsList = yield select(state => state.groups.list);
                groupsListLength = groupsList.length;
                currentGroup = groupsList.find(group => group.id === groupId);
            }

            if (groupsList && currentGroup) {
                yield put({
                    type: 'updateCurrentGroup',
                    payload: {
                        currentGroup,
                    },
                });
            }
        },
        *getUsersInGroup({ payload }, { call, put, select }) {
            const data = yield call(GenericService.create, {
                data: payload,
                method: 'IAM.users_in_group',
            });

            if (data?.statusCode === 200) {
                yield put({
                    type: 'addRoleAssignment',
                    payload: {
                        groupId: payload.id,
                        appendData: {
                            type: 'userInGroup',
                            data: {
                                ...data.body,
                            },
                        },
                    },
                });
            }
        },
        *getGroupRoleAssignments({ payload }, { call, put, select }) {
            const data = yield call(GenericService.create, {
                data: payload,
                method: 'IAM.role_assignments_group',
            });
            if (data?.statusCode === 200) {
                yield put({
                    type: 'addRoleAssignment',
                    payload: {
                        groupId: payload.id,
                        appendData: {
                            type: 'roleAssignment',
                            data: {
                                ...data.body,
                            },
                        },
                    },
                });
            }
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
                method: 'IAM.delete_group',
            });
            if (data?.statusCode === 200) {
                yield put({
                    type: 'deleteItem',
                    payload: payload.id,
                });

                notification.success({
                    message: `Groups`,
                    description: `group(s) deleted successfully`,
                });
            }
        },

        *create({ payload }, { call, put }) {
            const data = yield call(GenericService.create, {
                data: { ...payload },
                method: 'IAM.create_group',
            });
            if (data) {
                yield put({
                    type: 'saveSingle',
                    payload: {
                        ...data.body,
                    },
                });

                notification.success({
                    message: `Group`,
                    description: `Group created successfully`,
                });

                yield put(routerRedux.push('/service/iam/groups'));
            }
        },

        *removeUserFromGroup({ payload }, { call, put, select }) {
            yield put({
                type: 'updateLoadingState',
                payload: { id: payload.id, type: 'add' },
            });

            const data = yield call(GenericService.create, {
                data: { ...payload },
                method: 'IAM.remove_user_from_group',
            });

            const updateCurrentGroup = yield select(
                state => state.groups.currentGroup
            );
            const userInGroup = updateCurrentGroup.userInGroup;

            const newUsers = userInGroup.users.filter(
                user => user.id !== data.body.id
            );

            if (data) {
                yield put({
                    type: 'addRoleAssignment',
                    payload: {
                        groupId: payload.group_id,
                        appendData: {
                            type: 'userInGroup',
                            data: {
                                ...userInGroup,
                                users: [...newUsers],
                            },
                        },
                    },
                });
            }
            yield put({
                type: 'updateLoadingState',
                payload: { id: payload.id, type: 'remove' },
            });
        },

        *addUserToGroup({ payload }, { call, put, select }) {
            const data = yield call(GenericService.create, {
                data: { ...payload },
                method: 'IAM.add_user_to_group_after_creation',
            });

            const updateCurrentGroup = yield select(
                state => state.groups.currentGroup
            );

            const userInGroup = updateCurrentGroup.userInGroup;
            const newUsers = userInGroup.users.concat(data.body);
            if (data) {
                yield put({
                    type: 'addRoleAssignment',
                    payload: {
                        groupId: payload.group_id,
                        appendData: {
                            type: 'userInGroup',
                            data: {
                                ...userInGroup,
                                users: newUsers,
                            },
                        },
                    },
                });
            }
        },

        *update({ payload }, { call, put, select }) {
            const calledBefore = yield select(
                state => state.groups.calledBefore
            );
            if (!calledBefore || payload?.force) {
                const data = yield call(GenericService.query, {
                    method: 'IAM.groups',
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
        addRoleAssignment(state, action) {
            const appendDataObject = {
                [action.payload.appendData.type]:
                    action.payload.appendData.data,
            };

            return {
                ...state,
                list: state.list.map(group =>
                    group.id === action.payload.groupId
                        ? { ...group, ...appendDataObject }
                        : group
                ),
                currentGroup: {
                    ...state.currentGroup,
                    ...appendDataObject,
                },
            };
        },
        updateCurrentGroup(state, action) {
            return {
                ...state,
                currentGroup: action.payload.currentGroup,
            };
        },
        deleteItem(state, action) {
            const filteredList = state.list.filter(
                items => !action.payload.includes(items.id)
            );
            return { ...state, list: filteredList };
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
    },
};
