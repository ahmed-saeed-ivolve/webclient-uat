import { request } from '../../../../../utils/request';
import config from '../../../../../utils/config';

const { endpoints, apiPrefix } = config;
const { subnet } = endpoints;


export async function query(params) {

    
  return await request(
    subnet,
    {
      method: 'get',
      data: params,
    },
    apiPrefix,
  );
}



export async function create({ data }) {
  
  return await request(
    subnet,
    {
      method: 'post',
      data,
    },
    apiPrefix,
  );
}
export async function attachdetach({ data }) {

  
  return await request(subnet, {
    method: 'post',
    data
  }, apiPrefix);
}


export async function patch({ data }) {
  
  return await request(subnet, {
    method: 'patch',
    data
  }, apiPrefix);
}
