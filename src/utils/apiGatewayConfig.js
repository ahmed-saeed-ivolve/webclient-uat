const baseUrl = `${API_GATEWAY}/api/v1/`;

const serviceHeaders = () => {
    let token = localStorage.getItem('detasadToken');
    let user = localStorage.getItem('user');
    let scope = localStorage.getItem('detasadUserType');

    if (token && typeof token === 'string') {
        token = JSON.parse(token);
        user = JSON.parse(user);
        scope = JSON.parse(scope);
        return {
            'X-Auth-Token': token,
            'X-Org': scope.includes('domainScope')
                ? user.user.domain.id
                : user.project.id,
            'X-Scope': scope,
        };
    }
    return null;
};

const emailHeaders = () => {
    let authtoken = localStorage.getItem('detasadToken');
    authtoken = JSON.parse(authtoken);
    return {
        authtoken,
    };
};

const pricingHeaders = () => {
    let authtoken = localStorage.getItem('detasadToken');
    authtoken = JSON.parse(authtoken);
    return {
        authtoken,
    };
};

const usageReportHeaders = () => {
    let authtoken = localStorage.getItem('detasadToken');
    authtoken = JSON.parse(authtoken);
    return {
        authtoken,
    };
};

export default {
    service: {
        prefix: `${baseUrl}service`,
        headers: () => serviceHeaders(),
    },
    'usage-report': {
        prefix: `${baseUrl}usage-report`,
        headers: () => serviceHeaders(),
    },
    security: {
        prefix: `${baseUrl}security`,
        headers: () => serviceHeaders(),
    },
    trialAccount: {
        prefix: `${baseUrl}trialAccount`,
        headers: () => serviceHeaders(),
    },
    'support-Emailer': {
        prefix: `${baseUrl}support-Emailer`,
    },

    pricing: {
        prefix: `${baseUrl}pricing`,
        headers: () => serviceHeaders(),
    },

    images: {
        prefix: `${baseUrl}images`,
        headers: () => serviceHeaders(),
    },

    endpoints: {
        generic_backend: `/backend_service`,
    },
};
