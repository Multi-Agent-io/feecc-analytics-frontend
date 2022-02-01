export const getPassports = state => state.user.get('passports')
// export const getNewPassports = state => state.user.get('newPassports')
export const getAuthorizationStatus = state => state.user.getIn(['authorized'])
export const getLocation = state => state.router.location.pathname
export const getCurrentPassport = state => state.user.get('selectedPassport')
export const getPassportsNumber = state => state.user.get('passportsNumber')
export const getAllEmployees = state => state.user.get('employees')