import React, { useEffect, useState } from 'react';
import { client } from '../../lib/http/client';
import { GlobalErrorHandler } from '../../components/global-error-handler';
import axios from 'axios';
import { routes } from '../../lib/http/routes';
import { get } from 'lodash';

function Main() {
  const [secretInfo, setSecretInfo] = useState('no secret data');

  const getSecretInfo = async () => {
    const token = localStorage.getItem('token');
    let response;
    let data;
    try {
      response = await axios.request({
        headers: {
          Authorization: `token ${token}`,
        },
        method: 'get',
        baseURL: routes.baseURL(),
        url: '/users/1',
        withCredentials: true,
      })
      data = response.data;
    } catch (error) {
      GlobalErrorHandler.catchMe(error);
      return;
    }

    setSecretInfo(data);
  }

  useEffect(() => {
    getSecretInfo()
  }, [getSecretInfo, setSecretInfo, secretInfo])

  return (
    <div className="container">
      <div>Successfully</div>
      <div>{secretInfo}</div>
    </div>
  )
}

export default Main;