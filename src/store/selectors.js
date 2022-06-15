export const getPassports = (state) => state.user.get('passports');
// export const getNewPassports = state => state.user.get('newPassports')
export const getAuthorizationStatus = (state) => state.user.getIn(['authorized']);
export const getLocation = (state) => state.router.location.pathname;
export const getCurrentPassport = (state) => state.user.get('selectedPassport');
export const getPassportsNumber = (state) => state.user.get('passportsNumber');
export const getAllEmployees = (state) => state.user.get('employees');
export const getAllTypes = (state) => state.user.get('passportTypes');
export const getRule = (state) => state.user.get('rule');
export const getSchemas = (state) => state.user.get('schemas');
export const getSchema = (state, schemaId) => state.user.get('schemas').filter((schema) => schema.schema_id === schemaId)[0];
export const getSchemasTree = (state) => state.user.get('schemasTree');
export const getSchemaFromTree = (state, schemaId) => state.user.get('schemasTree')?.filter((schema) => schema.schema_id === schemaId)[0];
