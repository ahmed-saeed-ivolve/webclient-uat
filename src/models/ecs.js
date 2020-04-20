import * as GenericService from '@/pages/service/services/generic_service';
import { routerRedux } from 'dva/router';
import { Button, notification, message } from 'antd';
import { getPageQuery } from '@/utils/utils';

const statusCodeAndType = {
    success: (vm, status) => {
        return {
            message: `Instance ${status.toLowerCase()}`,
            description: `Your Instance '${vm}' is now in '${status}' state`,
        };
    },
};

const openNotificationWithIcon = type => {
    notification[type]({
        message: 'Notification Title',
        description:
            'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    });
};

export default {
    namespace: 'ecs',
    state: {
        selectedRows: [],
        list: [],
        recs: [],
        calledBefore: false,
        selectedInstance: null,
        currentInstanceConsoleUrl: null,
        listCurrentResizeVMs: [],
        loading: [],
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (
                    pathname.includes('/service/compute/elastic-cloud-services')
                ) {
                    dispatch({
                        type: 'update',
                        payload: { method: 'Compute.list' },
                    });
                    dispatch({
                        type: 'flavor/update',
                        payload: { method: 'Compute.list_flavors' },
                    });
                    dispatch({
                        type: 'ims/fetchList',
                        payload: { method: 'Image.list' },
                    });
                }
            });
        },
    },
    effects: {
        *getConsoleUrl({ payload }, { call, put, select }) {
            const data = yield call(GenericService.create, {
                method: 'Compute.get_console_url',
                data: {
                    server_id: payload.id,
                },
            });

            if (data?.statusCode === 200) {
                const body = JSON.parse(data.body);
                yield put({
                    type: 'save',
                    payload: {
                        currentInstanceConsoleUrl: body.console?.url,
                    },
                });
            }
        },
        *showCurrentInstance({ payload }, { call, put, select }) {
            const { id } = payload;

            let instance = null;

            const ecsList = yield select(state => state.ecs.list);

            if (ecsList.length === 0) {
                yield put.resolve({
                    type: 'update',
                    payload: { method: 'Compute.list' },
                });

                const newList = yield select(state => state.ecs.list);

                instance = newList.filter(record => record.id === id);
            } else {
                instance = ecsList.filter(record => record.id === id);
            }

            yield put.resolve({
                type: 'selectedRows',
                payload: instance,
            });

            yield put({
                type: 'addCurrentInstance',
                payload: {
                    instance,
                },
            });
        },
        *getSingleServer({ payload }, { call, put, select }) {
            const data = yield call(GenericService.create, {
                method: 'Compute.get_server',
                data: {
                    id: payload.id,
                },
            });
            if (data?.statusCode === 200) {
                yield put({
                    type: 'saveSingle',
                    payload: {
                        ...data.body,
                    },
                });
            }
        },
        *startServer({ payload }, { call, put, select }) {
            yield put({
                type: 'updateLoadingState',
                payload: { id: payload.id, type: 'add' },
            });

            const data = yield call(GenericService.create, {
                method: `Compute.${payload.method}`,
                data: {
                    id: payload.id,
                    type: payload.type ? payload.type : null,
                },
            });

            if (data?.statusCode === 200) {
                yield put({
                    type: 'afterStartORStop',
                    payload: { id: payload.id, data: data.body },
                });

                notification.success(
                    statusCodeAndType.success(data.body.name, data.body.status)
                );
            }
            yield put({
                type: 'updateLoadingState',
                payload: { id: payload.id, type: 'remove' },
            });
        },

        *deleteResources({ payload }, { call, put }) {
            const data = yield call(GenericService.patch, {
                data: payload,
                method: 'Compute.delete',
            });
            if (data?.statusCode === 200) {
                yield put.resolve({
                    type: 'deleteItem',
                    payload: { payload: payload, deleteResult: data.body },
                });

                if (data.body.error.length !== 0) {
                    notification.error({
                        message: `Instances`,
                        description: `${data.body.error.length} instance(s) failed to delete `,
                    });
                }
                if (data.body.success.length !== 0) {
                    notification.success({
                        message: `Instances`,
                        description: `${data.body.success.length} instance(s) deleted successfully`,
                    });
                }

                if (data.body.failedReserved.length !== 0) {
                    notification.error({
                        message: `Reseve Instances`,
                        description: `${data.body.failedReserved.length} instance(s) are reserved  and therefore cannot be deleted`,
                    });
                }
            }
        },

        *checkStatus({ payload }, { call, put }) {
            const data = yield call(GenericService.patch, {
                data: payload,
                method: 'Compute.check_server_status',
            });

            if (data?.statusCode === 200) {
                yield put.resolve({
                    type: 'deleteItem',
                    payload: payload,
                });
            }
        },

        *attach({ payload }, { call, put }) {
            const data = yield call(GenericService.create, {
                data: payload,
                method: 'Compute.add_floating_ip_to_server',
            });

            if (data?.statusCode === 200) {
                yield put.resolve({
                    type: 'saveAfterAttachingORDetaching',

                    payload: data,
                });
                notification.success({
                    message: 'Elastic IP Attached',
                    description: `Elastic IP 'is attached to Instance ${payload.instance_id} `,
                });
            }
        },

        *detach({ payload }, { call, put }) {
            const data = yield call(GenericService.create, {
                data: payload,
                method: 'Compute.remove_floating_ip_from_server',
            });
            if (data?.statusCode === 200) {
                yield put.resolve({
                    type: 'saveAfterAttachingORDetaching',

                    payload: data,
                });
                notification.success({
                    message: 'Elastic IP Detached',
                    description: `Elastic IP 'is detached from Instance ${payload.instance_id} `,
                });
            }
        },

        *resizeServer({ payload }, { call, put }) {
            yield put({
                type: 'addCurrentResizeVMs',
                payload: { server_id: payload.server_id },
            });
            const data = yield call(GenericService.create, {
                data: payload,
                method: 'Compute.resize_server',
            });

            if (data?.statusCode === 200) {
                yield put.resolve({
                    type: 'saveAfterResizingVM',
                    payload: {
                        data: data.body,
                        server_id: payload.server_id,
                    },
                });

                yield put(
                    routerRedux.push('/service/compute/elastic-cloud-services')
                );
                notification.info({
                    message: `Instance Resizing`,
                    description: `Your Instance '${data.body.name}' is resizing, you will be notified once completed`,
                });

                const getStatus = yield call(GenericService.create, {
                    data: data.body,
                    method: 'Compute.polling_resizing_instance',
                });

                if (getStatus?.statusCode === 200) {
                    yield put({
                        type: 'saveAfterResizingVM',
                        payload: {
                            data: getStatus.body,
                            server_id: payload.server_id,
                        },
                    });

                    notification.success({
                        message: `Instance Resized`,
                        description: `Your Instance '${data.body.name}' has resized`,
                    });
                }
            }

            yield put({
                type: 'removeCurrentResizeVMs',
                payload: { server_id: payload.server_id },
            });
        },

        *attachNetwork({ payload }, { call, put }) {
            const data = yield call(GenericService.create, {
                data: payload,
                method: 'Compute.create_server_interface',
            });

            if (data?.statusCode === 200) {
                yield put.resolve({
                    type: 'saveAfterAttachingORDetachingNetwork',
                    payload: { data: data.body, server_id: payload.id },
                });
                notification.success({
                    message: 'Interface Attached',
                    description: `Interface 'is attached to Instance ${payload.id} `,
                });
            }
        },

        *pollingInstance({ payload }, { call, put }) {
            const data = yield call(GenericService.create, {
                data: { id: payload.data.body.id },
                method: 'Compute.get_server',
            });

            if (data?.statusCode === 200) {
                var addressValues = Object.values(data.body.addresses);

                let dataNew = addressValues.reduce(
                    (acc, value) => [
                        ...acc,
                        ...value.map(
                            valObj => valObj['OS-EXT-IPS-MAC:mac_addr']
                        ),
                    ],
                    []
                );

                if (
                    !dataNew.includes(
                        payload.payload['interfaceDetail'][
                            'OS-EXT-IPS-MAC:mac_addr'
                        ]
                    )
                ) {
                    yield put.resolve({
                        type: 'saveAfterAttachingORDetachingNetwork',
                        payload: {
                            data: data.body,
                            server_id: payload.payload['server_id'],
                        },
                    });

                    notification.success({
                        message: 'Interface Detached',
                        description: `Interface '${payload.payload.interfaceDetail.networkName}' is detached from Instance ${payload.payload.server_id} `,
                    });

                    return;
                } else {
                    yield put({
                        type: 'pollingInstance',
                        payload: payload,
                    });
                }
            } else {
                message.error(`Error while attaching network`);
            }
        },

        *detachNetwork({ payload }, { call, put }) {
            yield put({
                type: 'updateLoadingState',
                payload: { id: payload.interfaceDetail.addr, type: 'add' },
            });
            const data = yield call(GenericService.create, {
                data: payload,
                method: 'Compute.delete_server_interface',
            });
            if (data?.statusCode === 200) {
                yield put.resolve({
                    type: 'pollingInstance',
                    payload: { data: data, payload: payload },
                });
            }
            yield put({
                type: 'updateLoadingState',
                payload: { id: payload.interfaceDetail, type: 'remove' },
            });
        },

        *attachSecurityGroup({ payload }, { call, put }) {
            const data = yield call(GenericService.create, {
                data: payload,
                method: 'Compute.add_security_group_to_server',
            });

            if (data?.statusCode === 200) {
                yield put({
                    type: 'saveAfterAttachingORDetachingSecurityGroup',
                    payload: [data.body.instances, payload.server],
                });
            }
        },

        *detachSecurityGroup({ payload }, { call, put }) {
            yield put({
                type: 'updateLoadingState',
                payload: { id: payload.security_group.id, type: 'add' },
            });
            const data = yield call(GenericService.create, {
                data: payload,
                method: 'Compute.remove_security_group_from_server',
            });

            if (data?.statusCode === 200) {
                yield put({
                    type: 'saveAfterAttachingORDetachingSecurityGroup',
                    payload: [data.body.instances, payload[0]],
                });
            }
            yield put({
                type: 'updateLoadingState',
                payload: { id: payload.security_group.id, type: 'remove' },
            });
        },

        *attachVolume({ payload }, { call, put }) {
            const data = yield call(GenericService.create, {
                data: payload,
                method: 'Compute.create_volume_attachment',
            });

            if (data?.statusCode === 200) {
                yield put({
                    type: 'saveAfterAttachingORDetachingVolume',
                    payload: [data.body.instances, payload.server],
                });

                notification.success({
                    message: `Volume`,
                    description: `volume attached successfully`,
                });
            }

            yield put({
                type: 'evs/update',
                payload: {
                    force: true,
                },
            });
        },

        *detachVolume({ payload }, { call, put }) {
            yield put({
                type: 'updateLoadingState',
                payload: { id: payload.volume_id, type: 'add' },
            });

            const data = yield call(GenericService.create, {
                data: payload,
                method: 'Compute.delete_volume_attachment',
            });

            if (data?.statusCode === 200) {
                yield put({
                    type: 'saveAfterAttachingORDetachingVolume',
                    payload: [data.body.instances, payload[0]],
                });
                notification.success({
                    message: `Volume`,
                    description: `volume detached successfully`,
                });
            }

            yield put({
                type: 'evs/update',
                payload: {
                    force: true,
                },
            });
            yield put({
                type: 'updateLoadingState',
                payload: { id: payload.volume_id, type: 'remove' },
            });
        },

        *create({ payload }, { call, put }) {
            const metadata = payload.Fifth.metadata;
            yield put(
                routerRedux.push('/service/compute/elastic-cloud-services')
            );
            const transformedData = Object.entries(payload).reduce(
                (acc, formVals) => {
                    const values = formVals[1];

                    const innerValues = Object.entries(values).reduce(
                        (acc, innerVal) => {
                            const actualInnerValue =
                                typeof innerVal[1].value === 'string'
                                    ? innerVal[1].value.trim()
                                    : innerVal[1].value;

                            return {
                                ...acc,
                                [innerVal[0]]:
                                    innerVal[0] === 'networks'
                                        ? [{ uuid: actualInnerValue }]
                                        : innerVal[0] === 'security_groups'
                                        ? actualInnerValue.map(id => ({
                                              name: id,
                                          }))
                                        : actualInnerValue,
                            };
                        },
                        {}
                    );

                    return { ...acc, ...innerValues };
                },
                {}
            );

            if (
                transformedData.key_name === '' ||
                transformedData.key_name === null ||
                transformedData.key_name === undefined
            ) {
                delete transformedData.key_name;
            }
            if (transformedData.security_groups.length === 0) {
                delete transformedData.security_groups;
            }

            const block_device_mapping_v2 = [
                {
                    uuid: transformedData.image_id,
                    source_type: 'image',
                    destination_type: 'volume',
                    boot_index: 0,
                    volume_size: transformedData.disk_size,
                },
            ];

            delete transformedData.disk_size;
            const data = yield call(GenericService.create, {
                data: {
                    ...transformedData,
                    block_device_mapping_v2,
                    metadata,
                },
                method: 'Compute.create',
            });
            if (data?.body?.error_message.length > 0) {
                notification.error({
                    message: `Error`,
                    description: `Unable to create remaining Instance(s) because ${data?.body?.error_message[0]}`,
                });
            }
            if (data?.body?.servers.length > 0) {
                yield put({
                    type: 'saveAfterCreate',
                    payload: {
                        ...data.body,
                    },
                });

                notification.info({
                    message: `Building Instance(s)`,
                    description: `${data.body.servers.length} Instance(s) are in building state`,
                });

                let getStatus = yield call(GenericService.create, {
                    data: { servers: data.body.servers },
                    method: 'Compute.polling_building_instance',
                });
                if (getStatus?.statusCode === 200) {
                    yield put({
                        type: 'polling',
                        payload: {
                            ...getStatus.body,
                        },
                    });
                    if (getStatus.body.vm_status.active.length > 0) {
                        notification.success({
                            message: `Active Instance(s)`,
                            description: `${getStatus.body.vm_status.active.length} Instance(s) are in active state`,
                        });
                    }
                    if (getStatus.body.vm_status.error.length > 0) {
                        notification.error({
                            message: `Error Instance(s)`,
                            description: `${getStatus.body.vm_status.error.length} Instance(s) are in error state
                            \nQuota might be exceeded.`,
                        });
                    }
                }
            }
        },
        *update({ payload }, { call, put, select }) {
            const calledBefore = yield select(state => state.ecs.calledBefore);

            if (!calledBefore || payload?.force === true) {
                const data = yield call(GenericService.query, {
                    method: 'Compute.list',
                });

                if (data) {
                    const { ecs, recs } = data;
                    yield put({
                        type: 'save',
                        payload: {
                            list: ecs.body,
                            recs,
                            calledBefore: true,
                        },
                    });
                }
            }
        },
    },

    reducers: {
        deleteItem(state, action) {
            let currentList = state.list;

            let filteredList = state.selectedRows.filter(
                item => !action.payload.deleteResult.success.includes(item)
            );
            const instancesNewList = state.list.filter(
                items => !action.payload.deleteResult.success.includes(items.id)
            );
            return {
                ...state,
                list: instancesNewList,
                selectedRows: filteredList,
            };
        },

        save(state, action) {
            return { ...state, ...action.payload };
        },

        saveAfterAttachingORDetachingNetwork(state, action) {
            const newSelectedInstance = action.payload.data;
            const filteredList = state.list.map(item =>
                item.id === action.payload.server_id
                    ? newSelectedInstance
                    : item
            );
            return {
                ...state,
                list: filteredList,
                selectedInstance: newSelectedInstance,
            };
        },

        saveAfterResizingVM(state, action) {
            const newSelectedInstance = action.payload.data;
            const filteredList = state.list.map(item =>
                item.id === action.payload.server_id
                    ? newSelectedInstance
                    : item
            );
            return { ...state, list: filteredList };
        },

        afterStartORStop(state, action) {
            const changeInstanceStatus = state.list.map(items => {
                if (items.id === action.payload.id) {
                    return action.payload.data;
                }
                return items;
            });

            if (state.selectedInstance !== null) {
                if (action.payload.id === state.selectedInstance.id) {
                    return {
                        ...state,
                        list: [...changeInstanceStatus],
                        selectedInstance: action.payload.data,
                    };
                }
            }

            return { ...state, list: [...changeInstanceStatus] };
        },

        polling(state, action) {
            const changeInstanceStatus = state.list.map(items => {
                for (
                    let i = 0;
                    i < action.payload.servers_created.length;
                    i++
                ) {
                    if (action.payload.servers_created[i].id === items.id) {
                        return action.payload.servers_created[i];
                    }
                }

                return items;
            });
            return { ...state, list: [...changeInstanceStatus] };
        },

        checkStatus(state, action) {
            const changeInstanceStatus = state.list.map(items => {
                if (items.id === action.payload.payload[0]) {
                    return action.payload.data;
                }
                return items;
            });

            return { ...state, list: [...changeInstanceStatus] };
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
        saveAfterCreate(state, action) {
            return {
                ...state,
                list: [...state.list, ...action.payload.servers],
            };
        },
        saveSingle(state, action) {
            return { ...state, list: [...state.list, { ...action.payload }] };
        },

        addCurrentInstance(state, action) {
            return {
                ...state,
                selectedInstance: { ...action.payload.instance[0] },
            };
        },

        removeCurrentShowInstance(state) {
            if (state.selectedInstance !== null) {
                const selectedInstance = state.selectedInstance.id;
                let filtered = state.selectedRows.filter(
                    elem => elem !== selectedInstance
                );

                return {
                    ...state,
                    selectedInstance: null,
                    selectedRows: filtered,
                };
            } else {
                return { ...state, selectedInstance: null, selectedRows: [] };
            }
        },

        itemStatus(state, action) {
            const filteredList = state.list.map(items =>
                Object.values(action.payload.payload).includes(items.id)
                    ? (items = action.payload.data)
                    : items
            );

            return { ...state, list: state.list };
        },

        updateLoadingState(state, action) {
            return {
                ...state,
                loading:
                    action.payload.type === 'add'
                        ? [...state.loading, action.payload.id]
                        : state.loading.filter(id => id !== action.payload.id),
            };
        },

        saveAfterAttachingORDetachingVolume(state, action) {
            let newSelectedInstance = action.payload[0];
            let finalList = state.list.map(items =>
                items.id === action.payload[0].id ? newSelectedInstance : items
            );
            return {
                ...state,
                list: finalList,
                selectedInstance: newSelectedInstance,
            };
        },

        saveAfterAttachingORDetaching(state, action) {
            let newSelectedInstance = action.payload.body.instances;
            let finalList = state.list.map(items =>
                items.id === action.payload.body.instances.id
                    ? newSelectedInstance
                    : items
            );
            return {
                ...state,
                list: finalList,
                selectedInstance: newSelectedInstance,
            };
        },

        addCurrentResizeVMs(state, action) {
            return {
                ...state,
                listCurrentResizeVMs: [
                    ...state.listCurrentResizeVMs,
                    action.payload.server_id,
                ],
            };
        },

        removeCurrentResizeVMs(state, action) {
            let removeServer = state.listCurrentResizeVMs.filter(
                item => item !== action.payload.server_id
            );
            return {
                ...state,
                listCurrentResizeVMs: removeServer,
            };
        },

        saveAfterAttachingORDetachingSecurityGroup(state, action) {
            let newSelectedInstance = action.payload[0];
            let finalList = state.list.map(items =>
                items.id === action.payload[0].id ? newSelectedInstance : items
            );
            return {
                ...state,
                list: finalList,
                selectedInstance: newSelectedInstance,
            };
        },
    },
};
