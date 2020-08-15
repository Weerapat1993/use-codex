import { createContext } from "react"
import produce from "immer"
import { IAction, ICreateSliceConfig, IContextStore, IDispatchStore, IConfigureStore } from './@types/interface'

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

export const configureStore = (config: IConfigureStore) => {
  const { reducer, initialState } = config;
  const reducerNames = Object.keys(reducer).map(key => key)
  const ContextStore: IContextStore = {};
  const DispatchStore: IDispatchStore = {};
  reducerNames.forEach(name => {
    ContextStore[name] = createContext(initialState[name]);
    DispatchStore[name] = createContext({})
  })
  const Context = (name: string) => ContextStore[name]
  const Dispatch = (name: string) => DispatchStore[name]
  return {
    Context,
    Dispatch,
    initialState,
    reducer,
  }
}