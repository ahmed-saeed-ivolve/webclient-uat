import { request } from '@/utils/request';

export async function createCompute() {
  return await request('/api/users');
}
export async function queryCurrent() {
  return await request('/api/currentUser');
}
export async function queryKeypair() {
  return await request('/api/keypair');
}

export async function queryNotices() {
  return await request('/api/notices');
}
