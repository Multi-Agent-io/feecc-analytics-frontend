import { types } from "./common";
import axios from "axios";
import conf from '../config.json'

// export const doLoginAttempt = (dispatch, login, password, status = true) => {
//     dispatch({type: types.USER__AUTHORIZE, status: status})
// }

export const doGetAuthToken = (username, password) => {
  return new Promise((resolve, reject) => {
    axios.post(
      `${ conf.base_url }/token`,
      `username=${ username }&password=${ password }&scope=&client_id=&client_secret=`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem('token', res.data.access_token)
          resolve("loggedIn")
        } else
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
      `${ conf.base_url }/api/v1/users/me`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ localStorage.getItem('token') }`
        }
      }
    )
      .then((res) => {
        if (res.status === 200) {
          dispatch({type: types.USER__FETCH_INFO, ...res.data})
          resolve(res)
        } else
          reject(res)
      })
      .catch((error) => reject(error))
  })
}

export const doGetPassports = (dispatch, page = 1, size = 12, name = null, date = null, overtime = null, rework = null, deviceTypes = null, dateDirection = "asc", passportType = 'production') => {
  return new Promise((resolve, reject) => {
    let passTypes = ''
    if (typeof deviceTypes === 'string')
      passTypes = deviceTypes.replaceAll(', ', ',')
    let request = `${ conf.base_url }/api/v1/passports`
    request += '/?page=' + page + '&items=' + size
    if (name !== null && name !== '' && name !== undefined)
      request += '&name=' + name
    if (date !== null && date !== '' && date !== undefined)
      request += '&date=' + new Date(date + 86400000).toISOString()
    if (passTypes !== null && passTypes !== '' && passTypes !== undefined && typeof passTypes === 'string')
      request += '&types=' + passTypes
    if (dateDirection !== null && dateDirection !== '' && dateDirection !== undefined && typeof dateDirection === 'string')
      request += "&sort_by_date=" + dateDirection

    //TODO remove after development of these filters is done
    let devBlock = true
    //
    if (overtime !== null && overtime !== undefined && !devBlock)
      request += '&overtime=' + overtime
    if (rework !== null && rework !== undefined && !devBlock)
      request += '&rework=' + rework
    request += '&status=' + passportType
    axios.get(
      request,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ localStorage.getItem('token') }`
        }
      }
    )
      .then((res) => {
        if (res.status === 200) {
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
    axios.get(`${ conf.base_url }/api/v1/passports/${ internalId }`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ localStorage.getItem('token') }`
        }
      })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data)
          dispatch({type: types.USER__FETCH_SELECTED_PASSPORT, passport: res.data.passport})
        } else {
          reject(res)
        }
      })
      .catch(reject)
  })
}

export const decodeUser = (dispatch, username) => {
  return new Promise((resolve, reject) => {
    axios.post(
      `${ conf.base_url }/api/v1/employees/decode`,
      {"encoded_name": username},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ localStorage.getItem('token') }`
        }
      })
      .then((res) => {
        if (res.status === 200) {
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

export const doGetPassportTypes = (dispatch) => {
  return new Promise((resolve, reject) => {
    axios.get(
      `${ conf.base_url }/api/v1/passports/types`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ localStorage.getItem('token') }`
        }
      }
    )
      .then((res) => {
        console.log(res)
        if (res.status === 200) {
          dispatch({type: types.USER__FETCH_PASSPORT_TYPES, passportTypes: res.data.data})
          resolve(res)
        } else
          reject(res)
      })
      .catch((err) => {
        console.log(err)
        reject(err)
      })
  })
}

export const doApproveProtocol = (protocolId) => {
  return new Promise((resolve, reject) => {
    axios.post(
      `${ conf.base_url }/api/v1/tcd/protocols/${ protocolId }/approve`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ localStorage.getItem('token') }`
        }
      }
    ).then((res) => {
      res.status === 200 && res.data.status_code === 200
        ? resolve(true)
        : reject(res)
    }).catch(reject)
  })

}

export const doGetSchemas = (dispatch) => {
  return new Promise((resolve, reject) => {
    axios.get(
      `${ conf.base_url }/api/v1/schemas`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ localStorage.getItem('token') }`
        }
      })
      .then(res => {
        let schemas = [...res.data.data]
        let tree = schemas.filter((schema) => schema.parent_schema_id === null)
        tree.forEach((schema) => schema['innerSchemas'] = schemas.filter((item) => item.parent_schema_id === schema.schema_id))

        dispatch({type: types.USER__FETCH_SCHEMAS, data: res.data.data, count: res.data.count, tree: tree})
      resolve(res.data)
    })
      .catch(res => reject(res))
  })
}