import axios from 'axios';
import { routes } from './routes';

export const client = {
  post: (url: string, data: any) => axios.request({
    data,
    method: 'post',
    baseURL: routes.baseURL(),
    url,
    withCredentials: true,
  }),
  get: (url: string, params: any) => axios.request({
    params,
    method: 'get',
    baseURL: routes.baseURL(),
    url,
    withCredentials: true,
  }),
};
