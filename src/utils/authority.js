
export function getOldAuthority(str) {
 
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem('antd-pro-authority') : str;

  let authority;

  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }

  if (typeof authority === 'string') {
    return [authority];
  }
 

  if (!authority && ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return ['admin'];
  }

  return authority;
}

export function getAuthority(str) {
 
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem('detasadUserType') : str;

  let authority;
  

  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }

  if (typeof authority === 'string') {
    return [authority];
  }
 

 
 
 
 
  return authority;
}

export function setOldAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}


export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('detasadUserType', JSON.stringify(proAuthority));
}




