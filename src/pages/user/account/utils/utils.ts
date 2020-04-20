import { parse } from 'qs';

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function setAuthority(authority: string | string[]) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}

export function setDetasadAuthority(authority: string | string[], token: string) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem('detasadToken', JSON.stringify(token.tokenMetadata.tokenId));
  localStorage.setItem('user', JSON.stringify(token.token));
  if (JSON.stringify(token.allProjects)) {
    localStorage.setItem('allProjects', JSON.stringify(token.allProjects));
    localStorage.setItem('unscopedToken', JSON.stringify(token.unscopedToken));

  }
  return localStorage.setItem('detasadUserType', JSON.stringify(proAuthority));
}

export function unset() {
  localStorage.removeItem('detasadToken');
  localStorage.removeItem('detasadUserType');
}