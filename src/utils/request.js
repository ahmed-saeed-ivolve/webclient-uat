import { extend } from 'umi-request';
import { notification } from 'antd';

const codeMessage = {
    200: 'The server successfully returned the requested data.',
    201: 'New or modified data is successful',
    202: 'Request Accepted',
    204: 'No Content',
    400: 'Bad request',
    401: 'You do not have permission to proceed further (username or password is incorrect)',
    403: 'Forbidden',
    404: "The requests is made for a record that doesn't exist",
    406: 'Not Acceptable',
    410: 'Gone',
    422: 'Unprocessable Entity (WebDAV)',
    500: 'An error occurred on the server. Please check the server.',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'The gateway timed out',
};

const errorHandler = error => {
    try {
        if (error.data.message && error.response.status) {
            if (
                error?.response?.status === 404 &&
                error?.data?.message === 'Failed to validate token'
            ) {
                localStorage.clear();
                window.location.assign('/login');
                return;
            }

            notification.error({
                message: 'Error',
                description: error?.data?.message,
            });
        }
    } catch (error) {
        notification.error({
            message: 'Oh Snap!',
            description: 'Something went wrong, try again later',
        });
    }
};

const requestAuth = async (url, options, headers) => {
    return await extend({
        errorHandler,
        headers: {
            ...headers,
        },
        requestType: 'json',
        responseType: 'json',
    })(url, options, headers);
};

const c7Request = async (url, options, prefix) => {
    let token = localStorage.getItem('detasadToken');
    let user = localStorage.getItem('user');
    let scope = localStorage.getItem('detasadUserType');

    if (token && typeof token === 'string') {
        token = JSON.parse(token);
        user = JSON.parse(user);
        scope = JSON.parse(scope);
    } else {
        return;
    }

    return await extend({
        errorHandler,
        prefix,
        headers: {
            'X-Auth-Token': token,
            'X-Org': scope.includes('domainScope')
                ? user.user.domain.id
                : user.project.id,
            'X-Scope': scope,
        },
        requestType: 'json',
        responseType: 'json',
    })(url, { ...options });
};

const requestOrchestrator = async (url, options, prec7Requestfix) => {
    let token = localStorage.getItem('detasadToken');
    let user = localStorage.getItem('user');
    let scope = localStorage.getItem('detasadUserType');

    if (token && typeof token === 'string') {
        token = JSON.parse(token);
        user = JSON.parse(user);
        scope = JSON.parse(scope);
    } else {
        return;
    }

    return await extend({
        errorHandler,
        prefix,
        headers: {
            'X-Auth-Token': token,
            'X-Org': scope.includes('domainScope')
                ? user.user.domain.id
                : user.project.id,
            'X-Scope': scope,
        },
        requestType: 'json',
        responseType: 'json',
    })(url, { ...options });
};

const requestHandler = async (url, prefix, headers, options) => {
    return await extend({
        errorHandler,
        prefix,
        headers,
        requestType: 'json',
        responseType: 'json',
    })(url, { ...options });
};

export { requestAuth, requestOrchestrator, requestHandler, c7Request };
