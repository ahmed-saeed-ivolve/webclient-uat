import { requestHandler } from '@/utils/request';
import apiGatewayConfig from '@/utils/apiGatewayConfig';
import config from '@/utils/config';

const { endpoints } = config;
const { ims } = endpoints;
export async function query(params) {
    const config = apiGatewayConfig[ims];
    const { prefix } = config;
    const headers = config.headers();
    return await requestHandler(
        ims,
        {
            method: 'get',
            data: params,
        },
        prefix
    );
}

export async function create({ data }) {
    const config = apiGatewayConfig[ims];
    const { prefix } = config;
    const headers = config.headers();
    return await requestHandler(
        ims,
        {
            method: 'post',
            data,
        },
        prefix
    );
}

export async function patch({ data, imageId }) {
    debugger;
    const config = apiGatewayConfig['images'];
    const { prefix } = config;
    const configHeaders = config.headers();
    const headers = {
        ...configHeaders,
    };
    return await requestHandler(`/${imageId}`, prefix, headers, {
        method: 'patch',
        data,
    });
}
