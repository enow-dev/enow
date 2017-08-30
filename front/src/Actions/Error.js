import * as types from '../Constants/ActionTypes';

export const addError = (error) => ({type: types.ADD_ERROR, error});
export const removeError = () => ({type: types.REMOVE_ERROR});
