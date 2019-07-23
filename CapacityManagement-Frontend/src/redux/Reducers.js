import { combineReducers } from 'redux'
import {
    SELECT_GEOGRAPHY,
    SELECT_REGION
} from './Actions'

const initialState = {
    selectedGeography : ""
}

function regional(state = initialState, action) {
  switch (action.type) {
    case SELECT_GEOGRAPHY:{
      return {
        ...state,
        selectedGeography: action.selectedGeography
      }; 
    }       
    case SELECT_REGION:
     return state
    default:
      return state
  }
}

const capacityManagementApp = combineReducers({
  regional
})

export default capacityManagementApp