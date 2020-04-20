import { requestAuth } from '@/utils/request';
import { OpenstackAuth, MfaPasscodeAuth } from './index';

export async function fakeAccountLogin(params: FormDataType) {
    return requestAuth('/api/login/account', {
        method: 'POST',
        data: params,
    });
}

export async function getFakeCaptcha(mobile: string) {
    return requestAuth(`/api/login/captcha?mobile=${mobile}`);
}

export async function openstackLogin(authData: OpenstackAuth) {
    return await requestAuth(`${API_GATEWAY}/api/v1/auth/login`, {
        data: {
            ...authData,
        },
        method: 'post',
    });
}

export async function changeProject(authData: OpenstackAuth) {
    return await requestAuth(`${API_GATEWAY}/api/v1/auth/change-project`, {
        data: {
            ...authData,
        },
        method: 'post',
    });
}
export async function mfaPasscodeRequest(authData: MfaPasscodeAuth) {
    return await requestAuth(`${API_GATEWAY}/api/v1/auth/mfa-login`, {
        data: {
            ...authData,
        },
        method: 'post',
    });
}

export async function logout() {
    return await requestAuth(
        `${API_GATEWAY}/api/v1/auth/logout`,
        { method: 'delete' },
        { 'X-Auth-Token': localStorage.getItem('detasadToken') }
    );
}
