import {types} from './common'
import {fromJS} from "immutable"

export const filtersInitialState = fromJS({
    date: null,
    deviceType: '',
    page: null,
    pageSize: null,
    name: null,
    overwork: null,
    requiredFix: null
})

export const filtersReducer = (state = {}, action) => {
    if(action.type.startsWith('FILTERS__'))
        console.log('filters-reducer', action)

    switch (action.type) {
        case types.FILTERS__SET_FILTERS: {
            return {...state, ...action.filters}
        }
        case types.FILTERS__DROP_STORED_FILTERS: {
            return {...state, date: null, deviceType: '', page: 1,  pageSize: 11, name: null, overwork: null, requiredFix: null }
        }
        default: {
            return state
        }
    }
}