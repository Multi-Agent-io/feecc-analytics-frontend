import {types} from './common'

export const setFilters = (dispatch, filters) => {
    dispatch({type: types.FILTERS__SET_FILTERS, filters: filters})
}

export const dropStoredFilters = (dispatch) => {
    dispatch({type: types.FILTERS__DROP_STORED_FILTERS})
}