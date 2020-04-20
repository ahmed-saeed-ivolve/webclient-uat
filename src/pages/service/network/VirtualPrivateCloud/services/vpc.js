import { request } from '../../../../../utils/request';
import config from '../../../../../utils/config';

const { endpoints, apiPrefix } = config;
const { vpc } = endpoints;
export async function query(params) {
    return await request(
        vpc,
        {
            method: 'get',
            data: params,
        },
        apiPrefix
    );
}
export async function create(payload) {
    return await request(
        `${vpc}?method=${payload.method}`,
        {
            method: 'post',
            data: payload.data,
        },
        apiPrefix
    );
}

export async function patch(params) {
    return await request({
        url: vpc,
        method: 'patch',
        data: params['data'],
        headers: {},
    });
}
