import * as GenericService from '@/pages/service/services/generic_service';
import * as NetworkService from '../pages/service/network/VirtualPrivateCloud/services/vpc';
import { routerRedux } from 'dva/router';

export const initialFormData = {
    VPCBasicForm: {
        name: {
            value: '',
            name: 'name',
        },
        network_type: {
            value: '',
            name: 'network_type',
        },
        region: {
            value: '',
            name: 'region',
        },
    },
    SubnetCreation: {
        subnet_name: {
            value: '',
            name: 'subnet_name',
        },
        cidr_block: {
            value: '',
            name: 'cidr_block',
        },
        ip_version: {
            value: '',
            name: 'ip_version',
        },
        gateway: {
            value: '',
            name: 'gateway',
        },
        dns_addresses: {
            value: '',
            name: 'dns_addresses',
        },
        is_dhcp_enabled: {
            defaultChecked: true,
            name: 'is_dhcp_enabled',
        },
        enable_gateway: {
            defaultChecked: true,
            name: 'enable_gateway',
        },
        allocation_pool: {
            value: '',
            name: 'allocation_pool',
        },
    },
};
export default {
    namespace: 'createVPC',
    state: {
        formsData: {
            is_dhcp_enabled: true,
            enable_gateway: true,
        },
    },

    effects: {
        *create({ payload }, { call, put }) {
            const data = yield call(NetworkService.create, {
                data: payload,
                method: 'Network.create_network',
            });

            yield put({
                type: 'save',
            });
            yield put(routerRedux.push('/service/network/networks'));
        },
    },
    reducers: {
        updateFormData(state, { payload }) {
            return {
                ...state,
                formsData: {
                    ...state.formsData,
                    ...payload,
                },
            };
        },
        save(state, action) {
            return { ...state, ...action.payload, formsData: {} };
        },

        resetFormsData(state, { payload }) {
            return {
                ...state,
                formsData: {
                    is_dhcp_enabled: true,
                    enable_gateway: true,
                },
            };
        },
    },
};
