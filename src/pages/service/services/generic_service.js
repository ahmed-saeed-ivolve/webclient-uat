import { requestHandler } from '@/utils/request';
import { stringify } from 'qs';
import apiGatewayConfig from '@/utils/apiGatewayConfig';
import { notification } from 'antd';

const makeRequest = async (payload, requestedMethodURL) => {
    const { params, querystring } = payload;
    let requestMethod = payload.method;
    const urlArray =
        requestMethod.indexOf('.') > -1 ? requestMethod.split('.') : [];
    if (urlArray.length > 0) {
        const classOfURL = urlArray[0];
        const methodOfURL = urlArray[1];
        requestMethod = `/${classOfURL
            .trim()
            .toLowerCase()}/${methodOfURL.trim().toLowerCase()}`;
    }

    let url = requestMethod;
    if (params && params.length > 0) {
        url = `${url}/${params.join('/')}`;
    }
    if (querystring && Object.keys(querystring).length > 0) {
        const qs = stringify(querystring);
        url = `${url}?${qs}`;
    }

    const options = {
        method: requestedMethodURL,
    };

    if (options.method === 'post') {
        options.data = {
            ...payload.data,
        };
    }

    const config = payload.config
        ? apiGatewayConfig[payload.config]
        : apiGatewayConfig['service'];
    const { prefix } = config;
    const headers = config.headers();

    const data = await requestHandler(url, prefix, headers, { ...options });

    return data;
};

export async function query(payload) {
    return await makeRequest(payload, 'get');
}

export async function create(payload) {
    return await makeRequest(payload, 'post');
}

export async function patch(payload) {
    return await makeRequest(payload, 'post');
}

export async function getQueryWithData(payload) {
    return await makeRequest(payload, 'post');
}
