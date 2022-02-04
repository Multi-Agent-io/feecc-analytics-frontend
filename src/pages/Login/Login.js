import React, {useState} from 'react';
import styles from './Login.module.css'
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import {useTranslation} from "react-i18next";
import {doFetchUser, doGetAuthToken} from "../../store/userActions";
import {useDispatch} from "react-redux";
import {history} from "../../store/main";

export default function Login(props) {

    let {t} = useTranslation()
    let dispatch = useDispatch()
    let [username, setUsername] = useState('')
    let [password, setPassword] = useState('')

    let [usernameError, setUsernameError] = useState('')
    let [passwordError, setPasswordError] = useState('')

    let checkUsername = (username) => {
        if (username !== '')
            setUsernameError('')
        else
            setUsernameError(t('login.usernameIsRequired'))
        setUsername(username)
    }

    let checkPassword = (password) => {
        if (password !== '')
            setPasswordError('')
        else
            setPasswordError(t('login.passwordIsRequired'))
        setPassword(password)
    }

    let onKeyDownHandler = (key) => {
        if(key === 'Enter')
            doLogin()
    }

    let doLogin = () => {
        if (!username)
            setUsernameError(t('login.usernameIsRequired'))
        if (!password)
            setPasswordError(t('login.passwordIsRequired'))

        if (!usernameError && !passwordError) {
            doGetAuthToken(username, password)
                .then(() => {
                    doFetchUser(dispatch)
                        .then((res) => {
                            if(res.status === 200) {
                                history.push('/passports')
                            }
                        })
                        .catch((err) => {})
                })
                .catch((error) => {
                    setUsernameError(t('login.incorrectUsernameOrPassword'))
                    setPasswordError(t('login.incorrectUsernameOrPassword'))
                })
        }
    }

    return (
        <div className={styles.loginCardWrapper}>
            <div className={styles.loginCard}>
                <h2>{t('login.loginToProceed')}</h2>
                <div className={styles.inputsWrapper}>
                    <Input onChange={checkUsername} placeholder={t('login.Username')} type="text" error={usernameError}/>
                    <Input onKeyDown={onKeyDownHandler} onChange={checkPassword} placeholder={t('login.Password')} type="password" error={passwordError}/>
                </div>
                <Button onClick={doLogin}>{t('login.proceed')}</Button>
            </div>
        </div>
    );
}
