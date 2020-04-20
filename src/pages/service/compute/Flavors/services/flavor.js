import { request } from '../../../../../utils/request';
import config from '../../../../../utils/config';

const { endpoints, apiPrefix } = config;
const { flavor } = endpoints;
export async function query(params) {
  return await request(flavor, {
    method: 'get',
    data: params,
  }, apiPrefix);
}

export async function create({ data }) {
  
  return await request(flavor, {
    method: 'post',
    data
  }, apiPrefix);
}

export async function patch({ data }) {
  
  return await request(flavor, {
    method: 'patch',
    data
  }, apiPrefix);
}