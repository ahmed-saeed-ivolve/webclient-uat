import { request } from '../../../../../utils/request';
import config from '../../../../../utils/config';

const { endpoints, apiPrefix } = config;
const { evs } = endpoints;
export async function query(params) {
  
  return await request(evs, {
    method: 'get',
    data: params,
  }, apiPrefix);
}


export async function create({ data }) {

  
  return await request(evs, {
    method: 'post',
    data
  }, apiPrefix);
}

export async function patch({ data }) {
  
  return await request(evs, {
    method: 'patch',
    data
  }, apiPrefix);
}