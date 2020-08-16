import produce from "immer"
import { IAction, ICreateSliceConfig } from './@types/interface'

export const createSlice = (config: ICreateSliceConfig) => {
  const { name, initialState, reducers } = config
  const actions: any = {}
  Object.keys(reducers).forEach(key => {
    const actionTypes = `${name}/${key}`
    actions[key] = (payload: object) => ({ type: actionTypes, payload })
  })
  const reducer = produce((state: object = initialState, action: IAction) => {
    Object.keys(reducers).forEach(key => {
      const actionTypes = `${name}/${key}`
      if(action.type === actionTypes) {
        reducers[key](state, action)
      }
    })
  })
  return {
    name,
    initialState,
    actions,
    reducer,
  }
}