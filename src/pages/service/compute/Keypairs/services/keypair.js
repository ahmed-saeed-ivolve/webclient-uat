import { request } from '@/utils/request';
import config from '@/utils/config';

const { endpoints, apiPrefix } = config;
const { keypair } = endpoints;


export async function query(params) {
  return await request(keypair, {
    method: 'get',
    data: params,
  }, apiPrefix);
}

export async function create({ data }) {

  
  return await request(keypair, {
    method: 'post',
    data
  }, apiPrefix);
}

export async function patch({ data }) {
  
  return await request(keypair, {
    method: 'patch',
    data
  }, apiPrefix);
}