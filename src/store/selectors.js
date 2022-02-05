export const getPassports = state => state.user.get('passports')
// export const getNewPassports = state => state.user.get('newPassports')
export const getAuthorizationStatus = state => state.user.getIn(['authorized'])
export const getLocation = state => state.router.location.pathname
export const getCurrentPassport = state => state.user.get('selectedPassport')
export const getPassportsNumber = state => state.user.get('passportsNumber')
export const getAllEmployees = state => state.user.get('employees')
export const getAllTypes = state => state.user.get('passportTypes')

export const getFiltersValues = (state) => {
    return {
        deviceType: state.filters.deviceType,
        date: state.filters.date,
        overwork: state.filters.overwork,
        requiredFix: state.filters.requiredFix
    }
}