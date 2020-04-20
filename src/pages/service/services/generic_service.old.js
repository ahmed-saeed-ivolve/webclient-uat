import { request } from '@/utils/request';
import { requestOrchestrator } from '@/utils/request';

import config from '@/utils/orchestratorConfig';

const { endpoints, apiPrefix } = config;
export const { generic_backend } = endpoints;



export async function query(payload) {
  const data = await requestOrchestrator(
    `${generic_backend}?method=${payload.method}`,
    {
      method: 'post',
      data: payload.data,
    },
    apiPrefix,
  );
  return data;
}



export async function create(payload) {


  const data = await requestOrchestrator(
    `${generic_backend}?method=${payload.method}`,
    {
      method: 'post',
      data: payload.data
    },
    apiPrefix,
  );

 

  return data;
}

export async function patch(payload) {

  const data = await requestOrchestrator(
    `${generic_backend}?method=${payload.method}`,
    {
      method: 'post',
      data: payload.data,

    },
    apiPrefix,
  );

 

  return data;
}
