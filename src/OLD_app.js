import { initKeycloak } from '@/utils/utils';
import router from 'umi/router';
export function render(oldRender) {
  initKeycloak(authentication => {
    if (authentication) {
      localStorage.setItem('user', JSON.stringify(authentication));
      localStorage.setItem('token', JSON.stringify(authentication.token));
      localStorage.setItem('policy', JSON.stringify(authentication.policy));
    }

    oldRender();
  });
}
export function onRouteChange({ location, routes }) {}
