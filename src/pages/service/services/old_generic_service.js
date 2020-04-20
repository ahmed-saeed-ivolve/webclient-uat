import { request } from '@/utils/request';
import config from '@/utils/config';
const { endpoints, apiPrefix } = config;
const { generic_backend } = endpoints;


export async function query(payload) {
  return await request(
    `${generic_backend}?method=${payload.method}`,
    {
      method: 'post',
      data: payload.data
    },
    apiPrefix,
  );
}

export async function create(payload) {
  
  
  return await request(
    `${generic_backend}?method=${payload.method}`,
    {
      method: 'post',
      data: payload.data,
    },
    apiPrefix,
  );
}
export async function patch(payload) {
  
  
  return await request(
    `${generic_backend}?method=${payload.method}`,
    {
      method: 'post',
      data: payload.data,
    },
    apiPrefix,
  );
}
