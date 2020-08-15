import { createContext } from "react"
import produce from "immer"
import { IAction, IState, ICreateSliceConfig, IContextStore, IDispatchStore, IConfigureStore } from './@types/interface'

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

export const querySlice = (name: string) => createSlice({
  name,
  initialState: {
    keys: {}
  },
  reducers: {
    request: (state: IState, action: IAction) => {
      const { key } = action.payload
      if(!state.keys[key]) {
        state.keys[key] = {};
      }
      state.keys[key].loading = true;
      state.keys[key].isLoaded = false;
      state.keys[key].error = ''
    },
    success: (state: IState, action: IAction) => {
      const { key, data } = action.payload
      if(!state.keys[key]) {
        state.keys[key] = {};
      }
      state.keys[key].loading = false;
      state.keys[key].isLoaded = true;
      state.keys[key].data = data;
      state.keys[key].error = ''
    },
    failure: (state: IState, action: IAction) => {
      const { key, error } = action.payload
      if(!state.keys[key]) {
        state.keys[key] = {};
      }
      state.keys[key].loading = false;
      state.keys[key].isLoaded = false;
      state.keys[key].error = error.message;
    },
  },
});

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