/*
 * action types
 */

export const SELECT_GEOGRAPHY = 'SELECT_GEOGRAPHY'
export const SELECT_REGION = 'SELECT_REGION'

/*
 * other constants
*/

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}

/*
 * action creators
 */

export function selectGeography(selectedGeography) {
  return { type: SELECT_GEOGRAPHY, selectedGeography }
}

export function selectRegion(index) {
  return { type: SELECT_REGION, index }
}
