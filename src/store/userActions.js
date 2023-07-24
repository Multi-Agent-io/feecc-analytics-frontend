import { types } from './common';
import axios from 'axios';
import conf from '../config.json';

// export const doLoginAttempt = (dispatch, login, password, status = true) => {
//     dispatch({type: types.USER__AUTHORIZE, status: status})
// }

export const doGetAuthToken = (username, password, keepSession) => {
  return new Promise((resolve, reject) => {
    axios.post(
      `${conf.base_url}/token?keep_session=${keepSession}`,
      `username=${username}&password=${password}&scope=&client_id=&client_secret=`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem('token', res.data.access_token);
          resolve('loggedIn');
        } else {
          reject(res);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const doFetchUser = (dispatch) => {
  return new Promise((resolve, reject) => {
    axios.get(
      `${conf.base_url}/api/v1/users/me`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
      .then((res) => {
        if (res.status === 200) {
          dispatch({ type: types.USER__FETCH_INFO, ...res.data });
          resolve(res);
        } else {
          reject(res);
        }
      })
      .catch((error) => reject(error));
  });
};

export const doGetPassports = (
  dispatch,
  page = 1,
  size = 12,
  name = null,
  date = null,
  overtime = null,
  rework = null,
  deviceTypes = null,
  dateDirection = 'asc',
  passportType = 'production',
) => new Promise((resolve, reject) => {
  let passTypes = '';
  if (typeof deviceTypes === 'string') {
    passTypes = deviceTypes.replaceAll(', ', ',');
  }
  let request = `${conf.base_url}/api/v1/passports`;

  request += `/?page=${page}&items=${size}&status=${passportType}`;

  if (name !== null && name !== '' && name !== undefined) {
    request += `&name=${name}`;
  }
  if (date !== null && date !== '' && date !== undefined) {
    request += `&date=${new Date(date + 86400000).toISOString()}`;
  }
  if (
    passTypes !== null
    && passTypes !== ''
    && passTypes !== undefined
    && typeof passTypes === 'string'
  ) {
    request += `&types=${passTypes}`;
  }
  if (
    dateDirection !== null
    && dateDirection !== ''
    && dateDirection !== undefined
    && typeof dateDirection === 'string'
  ) {
    request += `&sort_by_date=${dateDirection}`;
  }

  // // TODO remove after development of these filters is done
  // const devBlock = true;
  // //
  // if (overtime !== null && overtime !== undefined && !devBlock) {
  //   request += `&overtime=${overtime}`;
  // }
  // if (rework !== null && rework !== undefined && !devBlock) {
  //   request += `&rework=${rework}`;
  // }
  if (passportType) request += `&status=${passportType}`;

  axios
    .get(request, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then((res) => {
      if (res.status === 200) {
        resolve(res.data);
        dispatch({
          type: types.USER__FETCH_PASSPORTS,
          data: res.data.data,
          count: res.data?.count || 10,
        });
      } else reject(res);
    })
    .catch((error) => {
      reject(error);
    });
});



export const doGetPassport = (dispatch, internalId) => new Promise((resolve, reject) => {
  axios
    .get(`${conf.base_url}/api/v1/passports/${internalId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then((res) => {
      if (res.status === 200) {
        resolve(res.data);
        dispatch({
          type: types.USER__FETCH_SELECTED_PASSPORT,
          passport: res.data.passport,
        });
      } else {
        reject(res);
      }
    })
    .catch(reject);
});

export const decodeUser = (dispatch, username) => {
  return new Promise((resolve, reject) => {
    axios.post(
      `${conf.base_url}/api/v1/employees/decode`,
      { 'encoded_name': username },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((res) => {
        if (res.status === 200) {
          dispatch({
            type: types.USER__DECODE_EMPLOYEE,
            userHash: username,
            username: res.data.employee?.name || 'Сотрудник не найден'
          });
          resolve(res.data);
        } else {
          reject(res);
        }
      })
      .catch(reject);
  });
};

export const doGetPassportTypes = (dispatch) => {
  return new Promise((resolve, reject) => {
    axios.get(
      `${conf.base_url}/api/v1/passports/types`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
      .then((res) => {
        if (res.status === 200) {
          dispatch({
            type: types.USER__FETCH_PASSPORT_TYPES,
            passportTypes: res.data.data
          });
          resolve(res)
        } else {
          reject(res)
        }
      })
      .catch((err) => {
        reject(err)
      })
  })
}


export const doGetProtocols = (dispatch, page = 1, size = 12, name = null, date = null, status = null, dateDirection = 'asc') => {
  return new Promise ((resolve, reject) => {
    let request = `${conf.base_url}/api/v1/tcd/protocols`;
    request += `/?page=${page}&items=${size}`

    if (name !== null && name !== undefined && name !== '') {
      request += `&name=${name}`
    }
    if (date !== null && date !== undefined && date !== '') {
      request += `&date=${date}`
    }
    if (status !== null && status !== undefined && status !== '') {
      request += `&status=${status}`
    }
    if (dateDirection !== null && dateDirection !== '' && dateDirection !== undefined && typeof dateDirection === 'string') {
      request += `&sort_by_date=${dateDirection}`
    }


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
        if (res.status === 200) {
          resolve(res.data)
          dispatch({
            type: types.USER__FETCH_PROTOCOLS,
            data: res.data.data,
            count: res.data?.count || 10
          })
        } else {
          reject(res)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}
