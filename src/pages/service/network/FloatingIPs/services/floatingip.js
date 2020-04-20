import { request } from '../../../../../utils/request';
import config from '../../../../../utils/config';

const { endpoints, apiPrefix } = config;
const { floatingip } = endpoints;
export async function query(params) {
  return await request(
    floatingip,
    {
      method: 'get',
      data: params,
    },
    apiPrefix,
  );
}
export async function create({ data }) {
  return await request(
    floatingip,
    {
      method: 'post',
      data,
    },
    apiPrefix,
  );
}

export async function attachdetach({ data }) {
  return await request(
    floatingip,
    {
      method: 'post',
      data,
    },
    apiPrefix,
  );
}

export async function patch(params) {
  return await request({
    url: floatingip,
    method: 'patch',
    data: params['data'],
    headers: {},
  });
}
