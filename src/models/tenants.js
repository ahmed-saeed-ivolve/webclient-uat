import * as GenericService from '@/pages/service/services/generic_service';
import { routerRedux } from 'dva/router';
import { notification } from 'antd';

export default {
    namespace: 'projects',
    state: {
        list: [],
        currentProject: null,
        calledBefore: false,
        selectedRows: [],
        forceSetNewState: false,
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname.includes('/service/iam/projects')) {
                    dispatch({
                        type: 'update',
                        payload: {
                            force: true,
                        },
                    });
                    dispatch({
                        type: 'users/fetchRoles',
                        payload: {
                            force: true,
                        },
                    });
                }
            });
        },
    },
    effects: {
        *getCurrentProjectAssignments({ payload }, { call, put, select }) {
            const data = yield call(GenericService.getQueryWithData, {
                method: 'IAM.get_role_of_users_and_groups_in_project',
                data: {
                    project_id: payload.projectId,
                },
            });

            try {
                yield put({
                    type: 'addRolesToCurrentProject',
                    payload: {
                        ...data.body,
                    },
                });
            } catch (e) {}
        },
        *selectCurrentProject({ payload }, { call, put, select }) {
            const { projectId } = payload;

            let project = null;

            const projectList = yield select(state => state.projects.list);

            if (projectList.length === 0) {
                yield put.resolve({
                    type: 'update',
                    payload: {
                        force: true,
                    },
                });

                const newList = yield select(state => state.projects.list);

                project = newList.filter(record => record.id === projectId);
            } else {
                project = projectList.filter(record => record.id === projectId);
            }

            yield put.resolve({
                type: 'selectedRows',
                payload: project,
            });

            yield put.resolve({
                type: 'addCurrentProject',
                payload: {
                    project,
                },
            });

            yield put.resolve({
                type: 'getCurrentProjectAssignments',
                payload: {
                    projectId: project[0].id,
                },
            });
        },
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
                data: { project_id: payload.id },
                method: 'IAM.delete_project',
            });

            if (data?.statusCode === 200) {
                yield put({
                    type: 'deleteItem',
                    payload: payload.id,
                });

                notification.success({
                    message: `projects`,
                    description: `project(s) deleted successfully`,
                });
            }
        },

        *create({ payload }, { call, put }) {
            const data = yield call(GenericService.create, {
                data: { ...payload },
                method: 'IAM.create_project',
            });
            if (data) {
                yield put({
                    type: 'saveSingle',
                    payload: {
                        ...data.body,
                    },
                });

                if (data?.statusCode === 200) {
                    notification.success({
                        message: `Projects`,
                        description: `project Created successfully`,
                    });

                    yield put(routerRedux.push('/service/iam/projects'));
                }
            }
        },

        *update({ payload }, { call, put, select }) {
            const calledBefore = yield select(
                state => state.projects.calledBefore
            );
            if (!calledBefore || payload?.force === true) {
                const data = yield call(GenericService.query, {
                    method: 'IAM.projects',
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

        *assignRolesToUsersAndGroupsOnProject(
            { payload },
            { call, put, select }
        ) {
            const {
                addedGroups,
                addedUsers,
                removedGroups,
                removedUsers,
                role_id,
                project_id,
            } = payload;

            if (addedGroups) {
                yield put.resolve({
                    type: 'assignRoleToGroupsOnProject',
                    payload: { project_id, role_id, groups: addedGroups },
                });
            }
            if (addedUsers) {
                yield put.resolve({
                    type: 'assignRoleToUsersOnProject',
                    payload: { project_id, role_id, users: addedUsers },
                });
            }
            if (removedGroups) {
                yield put.resolve({
                    type: 'unassignRoleToGroupsOnProject',
                    payload: { project_id, role_id, groups: removedGroups },
                });
            }
            if (removedUsers) {
                yield put.resolve({
                    type: 'unassignRoleToUsersOnProject',
                    payload: { project_id, role_id, users: removedUsers },
                });
            }

            yield put({
                type: 'getCurrentProjectAssignments',
                payload: { projectId: payload.project_id },
            });
        },

        *assignRoleToUsersOnProject({ payload }, { call, put, select }) {
            const data = yield call(GenericService.create, {
                data: { ...payload },
                method: 'IAM.assign_role_to_users_in_project',
            });
        },

        *assignRoleToGroupsOnProject({ payload }, { call, put, select }) {
            const data = yield call(GenericService.create, {
                data: { ...payload },
                method: 'IAM.assign_role_to_groups_in_project',
            });
        },

        *unassignRoleToUsersOnProject({ payload }, { call, put, select }) {
            const data = yield call(GenericService.create, {
                data: { ...payload },
                method: 'IAM.unassign_role_to_users_in_project',
            });
        },

        *unassignRoleToGroupsOnProject({ payload }, { call, put, select }) {
            const data = yield call(GenericService.create, {
                data: { ...payload },
                method: 'IAM.unassign_role_to_groups_in_project',
            });
        },
    },
    reducers: {
        addRolesToCurrentProject(state, action) {
            return {
                ...state,
                currentProject: {
                    ...state.currentProject,
                    assignments: {
                        ...action.payload,
                    },
                },
            };
        },
        addCurrentProject(state, action) {
            return {
                ...state,
                currentProject: { ...action.payload.project[0] },
            };
        },

        deleteItem(state, action) {
            const filteredList = state.list.filter(
                items => !action.payload.includes(items.id)
            );
            return { ...state, list: filteredList, selectedRows: [] };
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
