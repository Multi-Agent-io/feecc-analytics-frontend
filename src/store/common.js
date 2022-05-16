import axios from 'axios'

export const types = {
    USER__AUTHORIZE              : 'USER__AUTHORIZE',
    USER__FETCH_INFO             : 'USER__FETCH_INFO',
    USER__FETCH_PASSPORTS        : 'USER_FETCH_PASSPORTS',
    USER__FETCH_SELECTED_PASSPORT: 'USER_FETCH_SELECTED_PASSPORT',
    USER__DECODE_EMPLOYEE        : 'USER__DECODE_EMPLOYEE',
    USER__FETCH_PASSPORT_TYPES   : 'USER__FETCH_PASSPORT_TYPES',
    USER__FETCH_PROTOCOLS        : "USER__FETCH_PROTOCOLS",
    USER__CHANGE_EDIT_MODE       : "USER__CHANGE_EDIT_MODE",
    USER__FETCH_SCHEMAS          : "USER__FETCH_SCHEMAS"
}

export const axiosWrapper = (dispatch, event, opts, successChecker) => {
    return axios(opts)
        .then(res => {
            if(!successChecker || successChecker(res.data)){
                if(event !== undefined) {
                    dispatch((typeof event === 'string') ? {type: event, ...res} : event(res))
                } else {
                    console.log("axiosWrapper Error")
                    console.log(res)
                }
            } else {
                console.log("axiosWrapper Error")
                console.log(res)
            }
        })
        .catch((error) => {
            console.log("axiosWrapper Error")
            console.log(error)
        })
}
