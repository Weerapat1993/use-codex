# use-codex

A hook to use Context API as a React hook to state management.

# Installation

```sh
yarn add use-codex
```

# API

## configureStore

`configureStore(config)` is very similar to [configureStore](https://redux-toolkit.js.org/tutorials/basic-tutorial#introducing-configurestore) in [Redux Toolkit](https://redux-toolkit.js.org) You can set `initialState` and `reducer` in here!

```js
// src/app/store.js
import { configureStore } from 'use-codex';
import { postSlice } from './post'
import { userSlice } from './user'

export const store = configureStore({
  initialState: {
    post: postSlice.initialState,
    user: userSlice.initialState,
  },
  reducer: {
    post: postSlice.reducer,
    user: userSlice.reducer,
  },
})
```

## createSlice

`createSlice(config)` is very similar to [createSlice](https://redux-toolkit.js.org/usage/usage-with-typescript#createslice) in [Redux Toolkit](https://redux-toolkit.js.org) As `createSlice` creates your actions as well as your reducer for you, you don't have to worry about type safety here. Action types can just be provided inline:

```js
// src/app/user.js
import { createSlice }  from 'use-codex'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    keys: {}
  },
  reducers: {
    request: (state, action) => {
      const { key } = action.payload
      if(!state.keys[key]) {
        state.keys[key] = {};
      }
      state.keys[key].loading = true;
      state.keys[key].isLoaded = false;
      state.keys[key].error = ''
    },
    success: (state, action) => {
      const { key, data } = action.payload
      if(!state.keys[key]) {
        state.keys[key] = {};
      }
      state.keys[key].loading = false;
      state.keys[key].isLoaded = true;
      state.keys[key].data = data;
      state.keys[key].error = ''
    },
    failure: (state, action) => {
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
```

## Provider

`Provider` is very similar to [Provider](https://redux-toolkit.js.org/tutorials/advanced-tutorial#rendering-the-provider) in [Redux Toolkit](https://redux-toolkit.js.org) As `Provider` creates your Context API and get provider by feature in one component.

```js
// src/App.js
import React from 'react';
import { Provider } from 'use-codex';
import { store } from './app/store';
import Post from './features/post/Post';
import User from './features/user/User';

const App = () => (
  <Provider store={store}>
    <Post userId={0} />
    <User userId={0} />
  </Provider>
);

export default App;
```

## useSelector

`useSelector` is very similar to `useSelector` in [Redux Toolkit](https://redux-toolkit.js.org) But you must add `reducer name` for get state in Context API by feature.

```js
import { useSelector } from 'use-codex'

const selectUser = (stateUser) => stateUser.id

const useUser = () => {
  const user = useSelector('user', selectUser);
  return { user }
}
```

## useDispatch

`useSelector` is very similar to `useSelector` in [Redux Toolkit](https://redux-toolkit.js.org) But you must add `reducer name` for get dispatch in Context API by feature.

```js
import { useDispatch } from 'use-codex'

const useUser = () => {
  const dispatch = useDispatch('user');
  const dispatchOneAction = useCallback((key) => dispatch(fetchUserByIdRequest(key)), [dispatch])
  const dispatchWithReduxThunk = useCallback((key) => fetchUserById(key)(dispatch), [dispatch])
  return { dispatchOneAction, dispatchWithReduxThunk }
}
```

## useConsumer

`useConsumer` is getting Context API Consumer By add `reducer name` 

```js
import { useConsumer } from 'use-codex'
import { fetchUserByIdRequest } from './action' 

const User = () => {
  const [UserContextConsumer, UserDispatchConsumer] = useConsumer('user');
  return (
    <div>
      <UserContextConsumer>
        {(user) => {
          return user.id
        }}
      </UserContextConsumer>
      <UserDispatchConsumer>
       {(dispatch) => {
          return (
            <button onClick={() => dispatch(fetchUserByIdRequest())}>Click</button>
          )
        }}
      </UserDispatchConsumer>
    </div>
  )
}
```