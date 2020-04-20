import { request } from '../../../../../utils/request';
import config from '../../../../../utils/config';

const { endpoints, apiPrefix } = config;
const { securitygroup } = endpoints;
export async function query(params) {
  
  return await request(securitygroup, {
    method: 'get',
    data: params,
  }, apiPrefix);
}
export async function create({ data }) {

  
  return await request(securitygroup, {
    method: 'post',
    data
  }, apiPrefix);
}

export async function patch({ data }) {
  
  return await request(securitygroup, {
    method: 'patch',
    data
  }, apiPrefix);
}
