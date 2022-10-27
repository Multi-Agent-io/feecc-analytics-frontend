import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styles from './Login.module.css';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { doFetchUser, doGetAuthToken } from '../../store/userActions';
import { history } from '../../store/main';

export default function Login() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const doLogin = () => {
    if (!username) setUsernameError(t('login.usernameIsRequired'));
    if (!password) setPasswordError(t('login.passwordIsRequired'));

    if (!usernameError && !passwordError) {
      doGetAuthToken(username, password)
        .then(() => {
          doFetchUser(dispatch)
            .then((res) => {
              if (res.status === 200) history.push('/passports');
            })
            .catch();
        })
        .catch(() => {
          setUsernameError(t('login.incorrectUsernameOrPassword'));
          setPasswordError(t('login.incorrectUsernameOrPassword'));
        });
    }
  };

  const checkUsername = (newUsername) => {
    if (newUsername !== '') setUsernameError('');
    else setUsernameError(t('login.usernameIsRequired'));
    setUsername(newUsername);
  };

  const checkPassword = (newPassword) => {
    if (newPassword !== '') setPasswordError('');
    else setPasswordError(t('login.passwordIsRequired'));
    setPassword(newPassword);
  };

  const onKeyDownHandler = (key) => {
    if (key === 'Enter') doLogin();
  };

  return (
    <div className={styles.loginCardWrapper}>
      <div className={styles.loginCard}>
        <h2>{t('login.loginToProceed')}</h2>
        <div className={styles.inputsWrapper}>
          <Input onChange={checkUsername} placeholder={t('login.Username')} type="text" error={usernameError} />
          <Input onKeyDown={onKeyDownHandler} onChange={checkPassword} placeholder={t('login.Password')} type="password" error={passwordError} />
        </div>
        <Button onClick={doLogin}>{t('login.proceed')}</Button>
      </div>
    </div>
  );
}
