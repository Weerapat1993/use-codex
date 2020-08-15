export interface ICreateSliceConfig {
  name: string
  initialState: object
  reducers: any
}

export interface IAction {
  type: string
  payload: IActionPayload
}

export interface IState {
  [key: string]: any
}

export interface IActionPayload {
  key?: string
  data?: any
  error?: IActionError
}

export interface IActionError {
  message: string
}

export interface IContextStore {
  [name: string]: any
}

export interface IDispatchStore {
  [name: string]: any
}

export interface IConfigureStore {
  initialState: IInitialState
  reducer: IReducer
}

export interface IConfigureStoreReturn {
  initialState: IInitialState
  Context: Function
  Dispatch: Function
  reducer: IReducer
}

export interface IInitialState {
  [name: string]: any
}

export interface IReducer {
  [name: string]: any
}

export interface IStoreContext {
  Context: Function
  Dispatch: Function
  initialState: IInitialState
  reducer: IReducer
}

export interface FeatureContextProviderProps {
  name: string
  store: IConfigureStoreReturn
}

export interface IContextComposer {
  contexts: Array<JSX.Element>
  children: React.ReactNode
}