/* eslint-disable no-useless-return */
import { Alert } from 'react-native';
import { all, takeLatest, call, put, delay } from 'redux-saga/effects';
import api from '../../../services/api';

import { signInSuccess, signFailure } from './actions';

export function* signIn({ payload }) {
  try {
    const { email, password } = payload;

    const response = yield call(api.post, 'sessions', { email, password });

    const { token, user } = response.data;

    if (user.provider) {
      Alert.alert(
        'Erro ao logar',
        'Login não permitido para prestadores de serviço'
      );
      yield put(signFailure());
      return;
    }

    api.defaults.headers.Authorization = `Bearer ${token}`;

    yield delay(3000);

    Alert.alert('Sucesso!', 'Deu certo');

    yield put(signInSuccess(token, user));

    // history.push('/dashboard');
  } catch (error) {
    yield delay(3000);

    Alert.alert('Erro de autenticação', 'Verifique os dados e tente novamente');

    yield put(signFailure());
  }
}

export function* signUp({ payload }) {
  try {
    const { email, password, name } = payload;

    yield call(api.post, 'users', {
      email,
      password,
      name,
    });

    // history.push('/');
  } catch (error) {
    Alert.alert('Erro ao cadastrar', 'Verifique os dados e tente novamente');
    yield put(signFailure());
  }
}

export function setToken({ payload }) {
  if (!payload) return;

  const { token } = payload.auth;

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

export function signOut() {
  // history.push('/');
}

export default all([
  takeLatest('@auth/SIGN_OUT', signOut),
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
]);
