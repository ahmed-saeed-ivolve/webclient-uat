import { parse, stringify } from 'qs';

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

const isUrl = path => reg.test(path);

const convertToLowerCase = str =>
    typeof str === 'string' ? str.replace(' ', '').toLowerCase() : '';

const isAntDesignPro = () => {
    if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
        return true;
    }

    return window.location.hostname === 'preview.pro.ant.design';
};

const isAntDesignProOrDev = () => {
    const { NODE_ENV } = process.env;

    if (NODE_ENV === 'development') {
        return true;
    }

    return isAntDesignPro();
};
export const getScope = () => {
    const scope = JSON.parse(localStorage.getItem('detasadUserType'))[0];
    return scope;
};

function getPageQuery() {
    return parse(window.location.href.split('?')[1]);
}

function checkAdminScope() {
    const userDetails = JSON.parse(localStorage.getItem('user'));
    const adminRole = userDetails.roles.filter(item => item.name === 'admin');
    if (adminRole.length > 0) {
        return true;
    } else {
        return false;
    }
}

export {
    isAntDesignProOrDev,
    isAntDesignPro,
    isUrl,
    getPageQuery,
    convertToLowerCase,
    checkAdminScope,
};
