import * as React from 'react';
import { useImmerReducer } from 'use-immer';
import { IStoreContext, FeatureContextProviderProps, IContextComposer, IProvider, IConfigureStore, IContextStore, IDispatchStore } from '../@types/interface';

const { useContext, createContext, useState } = React

const initialConfigureStore = {
  Context: (name: string) => {},
  Dispatch: (name: string) => {},
  initialState: {},
  reducer: {},
}

const StoreContext = createContext<IStoreContext>(initialConfigureStore)

// Feature Context Provider
export const FeatureContextProvider: React.FunctionComponent<FeatureContextProviderProps> = React.memo(({ children, name, store }): JSX.Element => {
  const AppContextProvider = store.Context(name).Provider
  const AppDispatchContextProvider = store.Dispatch(name).Provider
  const [state, dispatch] = useImmerReducer(store.reducer[name], store.initialState[name])
  return (
    <AppContextProvider value={state} displayName={`${name}Context`}>
      <AppDispatchContextProvider value={dispatch} displayName={`${name}DispatchContext`} >
        {children}
      </AppDispatchContextProvider>
    </AppContextProvider>
  )
})

FeatureContextProvider.defaultProps = {
  name: 'app',
  store: initialConfigureStore,
}

const ContextComposer = ({contexts, children}: IContextComposer) => {
  // Compose Consumers for renderfns
  if (typeof children === 'function') {
    const curriedContexts: Array<any> = [];
    const curry = (currentContexts: Array<any>) => {
      if (!currentContexts.length) {
        return children(...curriedContexts);
      }

      const Context = currentContexts.pop();

      return (
        <Context.Consumer>
          {(providedContext: any) => {
            curriedContexts.push(providedContext);

            return curry(currentContexts);
          }}
        </Context.Consumer>
      );
    }

    return curry(contexts.slice().reverse());

  // Compose Providers
  } else {
    return contexts.reduceRight((children, parent, i) => {
      return React.cloneElement(parent, {
        children,
      });
    }, children);
  }
}

export const Provider = ({ children, store }: IProvider) => {
  const [context] = useState(store);
  const features = Object.keys(store.reducer).map(key => key)
  const contexts = features.map(name => <FeatureContextProvider store={store} name={name} />)
  return (
    <StoreContext.Provider value={context}>
      <ContextComposer contexts={contexts}>
        {children}
      </ContextComposer>
    </StoreContext.Provider>
  )
}

Provider.defaultProps = {
  store: {
    initialState: {},
    reducer: {},
  }
}

// Custom Hooks
const useSelector = (reducerName: string, callback: Function) => {
  const myStore = useContext(StoreContext)
  const FeatureContext = myStore.Context(reducerName)
  const state = useContext(FeatureContext);
  return callback(state)
}

const useDispatch = (reducerName: string) => {
  const myStore = useContext(StoreContext)
  const FeatureDispatch = myStore.Dispatch(reducerName)
  const dispatch = useContext(FeatureDispatch);
  return dispatch;
}

const useConsumer = (reducerName: string) => {
  const store = useContext(StoreContext)
  const FeatureContext = store.Context(reducerName)
  const FeatureDispatch = store.Dispatch(reducerName)
  return [FeatureContext.Consumer, FeatureDispatch.Consumer]
}

const connect = (mapStateToProps: Function, mapDispatchToProps: Function) => (WrapperComponent: React.FunctionComponent) => {
  const Connect = (props: any): JSX.Element => {
    const state = mapStateToProps && typeof mapStateToProps === 'function' ? mapStateToProps(useSelector, props) : {}
    const dispatch = mapDispatchToProps && typeof mapDispatchToProps === 'function' ? mapDispatchToProps(useDispatch, props) : {}
    return <WrapperComponent {...state} {...dispatch} {...props} />;
  }
  return Connect;
}

const configureStore = (config: IConfigureStore) => {
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

export {
  useSelector,
  useDispatch,
  useConsumer,
  connect,
  configureStore,
}

