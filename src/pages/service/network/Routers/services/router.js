import { request } from '../../../../../utils/request';
import config from '../../../../../utils/config';

const { endpoints, apiPrefix } = config;
const { router } = endpoints;


export async function query(params) {
  return await request(
    router,
    {
      method: 'get',
      data: params,
    },
    apiPrefix,
  );
}



export async function create({ data }) {
  
  return await request(
    router,
    {
      method: 'post',
      data,
    },
    apiPrefix,
  );
}
export async function attachdetach({ data }) {

  
  return await request(router, {
    method: 'post',
    data
  }, apiPrefix);
}


export async function patch({ data }) {
  
  return await request(router, {
    method: 'patch',
    data
  }, apiPrefix);
}
