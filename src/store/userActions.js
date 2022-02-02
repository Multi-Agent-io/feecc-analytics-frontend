import {types} from "./common";
import axios from "axios";

// export const doLoginAttempt = (dispatch, login, password, status = true) => {
//     dispatch({type: types.USER__AUTHORIZE, status: status})
// }

export const doGetAuthToken = (username, password) => {
    return new Promise((resolve, reject) => {
        axios.post(
            'http://localhost:5002/token',
            `username=${username}&password=${password}&scope=&client_id=&client_secret=`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        )
            .then((res) => {
                if(res.status === 200) {
                    localStorage.setItem('token', res.data.access_token)
                    resolve("loggedIn")
                }
                else
                    reject(res)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export const doFetchUser = (dispatch) => {
    return new Promise((resolve, reject) => {
        axios.get(
            'http://localhost:5002/api/v1/users/me',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        )
            .then((res) => {
                if (res.status === 200){
                    dispatch({type: types.USER__FETCH_INFO, ...res.data})
                    resolve(res)
                } else
                    reject(res)
            })
            .catch((error) => reject(error))
    })
}

export const doGetPassports = (dispatch, page=1, size=12, name = null, date = null, overtime = null, rework = null) => {
    return new Promise((resolve, reject) => {
        let request = 'http://localhost:5002/api/v1/passports'
        request += '/?page=' + page + '&items=' + size
        if (name !== null && name !== '' && name !== undefined)
            request += '&name=' + name
        if (date !== null && date !== '' && date !== undefined)
            request += '&date=' + date
        //TODO remove after dev of filters is done
        let devBlock = true
        //
        if (overtime !== null && overtime !== undefined && !devBlock)
            request += '&overtime=' + overtime
        if (rework !== null && rework !== undefined && !devBlock)
            request += '&rework=' + rework
        axios.get(
            request,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        )
            .then((res) => {
                if(res.status === 200) {
                    resolve(res.data)
                    dispatch({type: types.USER__FETCH_PASSPORTS, data: res.data.data, count: res.data.count})
                } else
                    reject(res)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export const doGetPassport = (dispatch, internalId) => {
    return new Promise((resolve, reject) => {
        axios.get(`http://localhost:5002/api/v1/passports/${internalId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then((res) => {
                if (res.status === 200) {
                    resolve(res.data)
                    dispatch({type: types.USER__FETCH_SELECTED_PASSPORT, passport: res.data.passport})
                }
                else {
                    reject(res)
                }
            })
            .catch(reject)
    })
}

export const decodeUser = (dispatch, username) => {
    return new Promise((resolve, reject) => {
        axios.post(
            `http://localhost:5002/api/v1/employees/decode`,
            {"encoded_name":username},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then((res) => {
                if(res.status === 200){
                    dispatch({
                        type: types.USER__DECODE_EMPLOYEE,
                        userHash: username,
                        username: res.data.employee?.name || 'Сотрудник не найден'
                    })
                    resolve(res.data)
                } else {
                    reject(res)
                }
            })
            .catch(reject)
    })
}