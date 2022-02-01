import {types} from "./common";
import {fromJS} from "immutable";

export const userInitialState = fromJS({
    usrename: 'Iota',
    firstName: 'Ivan',
    lastName: 'Glebov',
    email: 'glebov.vanya@list.ru-RU',
    authorized: false,
    passports: [
    //     {
    //     model: 'Row 1 test name ',
    //     type: 'Test 1',
    //     date: '12.12.21',
    //     time: '14:35',
    //     needFix: false,
    //     overwork: true
    // },
    //     {
    //         model: 'Row 2 test name ',
    //         type: 'Test 2',
    //         date: '22.22.21',
    //         time: '24:00',
    //         needFix: true,
    //         overwork: false
    //     },
    //     {
    //         model: 'Row 1 test name ',
    //         type: 'Test 1',
    //         date: '12.12.21',
    //         time: '14:35',
    //         needFix: false,
    //         overwork: true
    //     },
    //     {
    //         model: 'Row 2 test name ',
    //         type: 'Test 2',
    //         date: '22.22.21',
    //         time: '24:00',
    //         needFix: true,
    //         overwork: false
    //     },
    //     {
    //         model: 'Row 1 test name ',
    //         type: 'Test 1',
    //         date: '12.12.21',
    //         time: '14:35',
    //         needFix: false,
    //         overwork: true
    //     },
    //     {
    //         model: 'Row 2 test name ',
    //         type: 'Test 2',
    //         date: '22.22.21',
    //         time: '24:00',
    //         needFix: true,
    //         overwork: false
    //     },
    //     {
    //         model: 'Row 1 test name ',
    //         type: 'Test 1',
    //         date: '12.12.21',
    //         time: '14:35',
    //         needFix: false,
    //         overwork: true
    //     },
    //     {
    //         model: 'Row 2 test name ',
    //         type: 'Test 2',
    //         date: '22.22.21',
    //         time: '24:00',
    //         needFix: true,
    //         overwork: false
    //     },
    //     {
    //         model: 'Row 1 test name ',
    //         type: 'Test 1',
    //         date: '12.12.21',
    //         time: '14:35',
    //         needFix: false,
    //         overwork: true
    //     },
    //     {
    //         model: 'Row 2 test name ',
    //         type: 'Test 2',
    //         date: '22.22.21',
    //         time: '24:00',
    //         needFix: true,
    //         overwork: false
    //     },
    //     {
    //         model: 'Row 1 test name ',
    //         type: 'Test 1',
    //         date: '12.12.21',
    //         time: '14:35',
    //         needFix: false,
    //         overwork: true
    //     },
    //     {
    //         model: 'Row 2 test name ',
    //         type: 'Test 2',
    //         date: '22.22.21',
    //         time: '24:00',
    //         needFix: true,
    //         overwork: false
    //     },
    //     {
    //         model: 'Row 1 test name ',
    //         type: 'Test 1',
    //         date: '12.12.21',
    //         time: '14:35',
    //         needFix: false,
    //         overwork: true
    //     },
    //     {
    //         model: 'Row 2 test name ',
    //         type: 'Test 2',
    //         date: '22.22.21',
    //         time: '24:00',
    //         needFix: true,
    //         overwork: false
    //     },
    //     {
    //         model: 'Row 1 test name ',
    //         type: 'Test 1',
    //         date: '12.12.21',
    //         time: '14:35',
    //         needFix: false,
    //         overwork: true
    //     },
    //     {
    //         model: 'Row 2 test name ',
    //         type: 'Test 2',
    //         date: '22.22.21',
    //         time: '24:00',
    //         needFix: true,
    //         overwork: false
    //     }
        ],
    passportsNumber: 0,
    selectedPassport: {},
    employees: {}
})

export const userReducer = (state = {}, action) => {
    console.log('user-reducer', action)

    switch (action.type) {
        case types.USER__AUTHORIZE: {
            return state
                .set('authorized', action.status)
        }
        case types.USER__FETCH_PASSPORTS: {
            let passports = []
            action.data.forEach((item, index) => {
                passports[index] = item
                if(passports[index].model === null)
                    passports[index].model = "Без названия"
                passports[index].needFix = Math.random() < 0.5 // Random boolean
                passports[index].overwork = Math.random() < 0.5 // Random boolean
                passports[index].time = passports.date
            })

            return state
                .set('passports', fromJS(passports))
                .set('passportsNumber', action.count)
                // .update('passports', item => console.log(item))
        }
        case types.USER__FETCH_SELECTED_PASSPORT: {
            return state
                .set('selectedPassport', fromJS(action.passport))
        }
        case types.USER__FETCH_INFO: {
            return state
                .set('username', action.username)
                .set('authorized', true)
        }
        case types.USER__DECODE_EMPLOYEE: {
            return state
                .setIn(['employees', action.userHash], action.username)
        }
        default:
            return state
    }
}