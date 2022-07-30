import cn from 'classnames';
import { get, reduce } from 'lodash';
import React, { BaseSyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { client } from '../../lib/http/client';
import { routes } from '../../lib/http/routes';

const initFields = [ 'username', 'email', 'password']
const initValues = reduce(initFields, (acc, key: string) => ({...acc, [key]: ''}), {})

function SigninForm(props: { setResponse: Function; }) {
  const { setResponse } = props;
  const { t } = useTranslation();

  const [valuesState, setValuesState] = useState(initValues)
  const [signinResultMessage, setSigninResultMessage] = useState('')

  /** Handler на изменения * */
  const changeHandler = (fieldName: string) => ({ target }: BaseSyntheticEvent) => {
    const newValuesState = { ...valuesState, [fieldName]: target.value };
    setValuesState(newValuesState)
  };

  /** Handler на отправку формы * */
  const submitHandler = async (e: BaseSyntheticEvent) => {
    e.preventDefault();

    const { data } = await client.post(routes.signinPath(), {
      username: get(valuesState, 'username'),
      password: get(valuesState, 'password'),
    });

    localStorage.setItem('token', get(data, 'token'));
    setResponse({ ok: true });
  }

  return(
    <form id="signin" onSubmit={submitHandler} noValidate={false} className="py-1">

      <div className="mb-3">
        <label htmlFor="username" className="form-label">{t('username')}</label>
        <input
          id="username"
          type="text"
          aria-label={t('username')}
          className={cn('p-2', 'form-control')}
          value={get(valuesState, 'username')}
          onChange={changeHandler('username')}
        />

      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">{t('password')}</label>
        <input
          id="password"
          type="password"
          aria-label={t('password')}
          className={cn('p-2', 'form-control')}
          value={get(valuesState, 'password')}
          onChange={changeHandler('password')}
        />
      </div>

      <div className="form-text">
        {get(signinResultMessage, 'username')}
      </div>

      <button
        type="submit"
        className="btn btn-outline-primary"
      >
        {t('submit')}
      </button>

    </form>
  );
}

export default SigninForm;
