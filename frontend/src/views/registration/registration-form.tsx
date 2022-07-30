import './registration.css';
import React, { BaseSyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import {
  keyBy, forOwn, get, set, reduce
} from 'lodash';
import { ValidationError } from 'yup';
import cn from 'classnames';
import { routes } from '../../lib/http/routes';
import { client } from '../../lib/http/client';
import { logger } from '../../lib/logger';

const initFields = [ 'username', 'email', 'password']
const initValues = reduce(initFields, (acc, key: string) => ({...acc, [key]: ''}), {})
const initValidationMessages = reduce(initFields, (acc, key: string) => ({ ...acc, [key]: '' }), {})
const initIsExistMessages = reduce(initFields, (acc, key: string) => ({ ...acc, [key]: '' }), {})
const initIsInvalidState = reduce(initFields, (acc, key: string) => ({ ...acc, [key]: false }), {})
const initIsExistState = reduce(initFields, (acc, key: string) => ({ ...acc, [key]: false }), {})
const initIsExistStatePending = reduce(initFields, (acc, key: string) => ({ ...acc, [key]: false }), {})
const initTouchedState = reduce(initFields, (acc, key: string) => ({ ...acc, [key]: false }), {})

function RegistrationForm(props: { setResponse: Function; }) {
  const { setResponse } = props;
  const { t } = useTranslation();

  const [valuesState, setValuesState] = useState(initValues)
  const [validationMessagesState, setValidationMessagesState] = useState(initValidationMessages)
  const [isExistMessagesState, setIsExistMessagesState] = useState(initIsExistMessages)
  const [isInvalidState, setIsInvalidState] = useState(initIsInvalidState)
  const [isExistState, setIsExistState] = useState(initIsExistState)
  const [isExistStatePending, setIsExistStatePending] = useState(initIsExistStatePending)
  const [touchedState, setTouchedState] = useState(initTouchedState)

  /** Схема валидации **/
  const validationSchema = yup.object().shape({
    username: yup.string().trim().required(t('validation__required')),
    email: yup.string().required(t('validation__required')).email(t('validation__email_pattern')),
    password: yup.string().min(6, t('validation__min_6')).required(t('validation__required')),
  });

  /** Валидация формы - вспомогательная функция **/
  const getValidationErrors = (newValuesState: typeof valuesState) => {
    try {
      validationSchema.validateSync(newValuesState, { abortEarly: false });
      return {};
    } catch (error) {
      const errorInner = error instanceof ValidationError ? error.inner : [t('error_message__unknown')];
      return keyBy(errorInner, 'path');
    }
  };
  /** Валидация формы **/
  const validateForm = (newValuesState: typeof valuesState, newTouchedState: typeof touchedState) => {
    const validationErrors = getValidationErrors(newValuesState);

    let newIsInvalidData = {};
    let newValidationMessagesState = {};

    forOwn(newValuesState, (value: string, fieldName: string) => {
      if (get(newTouchedState, fieldName)) {
        const error = validationErrors[fieldName];
        if (error) {
          newIsInvalidData = { ...newIsInvalidData, [fieldName]: true }
          const errorMessage = error instanceof ValidationError ? error.message : [t('error_message__unknown')];
          newValidationMessagesState = { ...newValidationMessagesState, [fieldName]: errorMessage }
        } else {
          newIsInvalidData = { ...newIsInvalidData, [fieldName]: false }
          newValidationMessagesState = { ...newValidationMessagesState, [fieldName]: '' };
        }
      }
    })

    setIsInvalidState({ ...isInvalidState, ...newIsInvalidData })
    setValidationMessagesState({ ...validationMessagesState, ...newValidationMessagesState })

    return Object.keys(validationErrors).length === 0;

  }

  /** Проверка доступности username и email * */
  const checkIsExist = async (newValuesState: typeof valuesState, newTouchedState: typeof touchedState) => {
    const query = {};
    if (get(newTouchedState, 'username')) {
      set(query, 'username', get(newValuesState, 'username'))
    }
    if (get(newTouchedState, 'email')) {
      set(query, 'email', get(newValuesState, 'email'))
    }

    setIsExistStatePending({ username: true, email: true });

    let { data } = await client.get(routes.registerPath(), query);

    let newIsExistData = {};
    let newIsExistMessagesData = {};

    if (get(newTouchedState, 'username')) {
      newIsExistData = { ...newIsExistData, username: !data?.username?.ok };
      newIsExistMessagesData = { ...newIsExistMessagesData, username: data?.username?.ok ? '' : t('check__username_is_exist') };
    }

    if (get(newTouchedState, 'email')) {
      newIsExistData = { ...newIsExistData, email: !data?.email?.ok };
      newIsExistMessagesData = { ...newIsExistMessagesData, email: data?.email?.ok ? '' : t('check__email_is_exist') };
    }

    setIsExistStatePending({ username: false, email: false });
    setIsExistState({ ...isExistState, ...newIsExistData });
    setIsExistMessagesState({ ...isExistMessagesState, ...newIsExistMessagesData })

    return !!(get(newTouchedState, 'username.ok') && get(newTouchedState, 'email.ok'))
  }

  /** Handler на изменения * */
  const changeHandler = (fieldName: string) => ({ target }: BaseSyntheticEvent) => {
    const newValuesState = { ...valuesState, [fieldName]: target.value };
    const newTouchedState = { ...touchedState, [fieldName]: true };
    setValuesState(newValuesState)
    setTouchedState(newTouchedState)
    validateForm(newValuesState, newTouchedState);
    checkIsExist(newValuesState, newTouchedState);
  };

  /** Handler на отправку формы * */
  const submitHandler = async (e: BaseSyntheticEvent) => {
    e.preventDefault();

    let newTouchedState = {};

    forOwn(touchedState, (value, fieldName) => {
      newTouchedState = { ...newTouchedState, [fieldName]: true }
    })

    setTouchedState(newTouchedState);

    /** Блокирующие проверки **/
    const checkExistOk = checkIsExist(valuesState, newTouchedState)
    const validationOk = validateForm(valuesState, newTouchedState)
    if ( !(validationOk && checkExistOk) ) return;

    const { data } = await client.post(routes.registerPath(), {
      username: get(valuesState, 'username'),
      email: get(valuesState, 'email'),
      password: get(valuesState, 'password'),
    });

    if (data?.ok) {
      setResponse({ ok: true });
      logger.verbose('Successfully registered user')
      return;
    }

    throw new Error(data);
  };

  return (
    <form id="registration" onSubmit={submitHandler} noValidate={false} className="py-1">

      <div className="mb-3">
        <label htmlFor="username" className="form-label">{t('username')}</label>
        <input
          id="username"
          type="text"
          aria-label={t('username')}
          className={cn('p-2', 'form-control', {
            'is-invalid': get(isInvalidState, 'username') || get(isExistState, 'username'),
            'is-valid': !get(isExistState, 'username') && get(valuesState, 'username') !== '' && !get(isExistStatePending, 'username')
          })}
          value={get(valuesState, 'username')}
          onChange={changeHandler('username')}
        />
        <div className="form-text">
          {get(validationMessagesState, 'username')}
        </div>
        <div className="form-text">
          {get(isExistMessagesState, 'username')}
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">{t('email')}</label>
        <input
          id="email"
          type="text"
          aria-label={t('email')}
          className={cn('p-2', 'form-control', {
            'is-invalid': get(isInvalidState, 'email') || get(isExistState, 'email'),
            'is-valid': !get(isExistState, 'email') && get(valuesState, 'email') !== '' && !get(isExistStatePending, 'email')
          })}
          value={get(valuesState, 'email')}
          onChange={changeHandler('email')}
        />
        <div className="form-text">
          {get(validationMessagesState, 'email')}
        </div>
        <div className="form-text">
          {get(isExistMessagesState, 'email')}
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">{t('password')}</label>
        <input
          id="password"
          type="password"
          aria-label={t('password')}
          className={cn('p-2', 'form-control', {
            'is-invalid': get(isInvalidState, 'password'),
            'is-valid': get(valuesState, 'password') !== ''
          })}
          value={get(valuesState, 'password')}
          onChange={changeHandler('password')}
        />
        <div className="form-text">
          {get(validationMessagesState, 'password')}
        </div>
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

export default RegistrationForm;
