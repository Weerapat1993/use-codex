# use-codex

A hook to use Context API as a React hook to state management.

# Installation

```sh
yarn add use-codex
```

# How to use

```js
// src/app/user.js
import axios from 'axios'
import get from 'lodash/get'
import { createSelector } from 'reselect';

const defaultState = {
  loading: false,
  error: '',
  isLoaded: false,
  data: [], 
}

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

export const { request, success, failure } = userSlice.actions;

// Async Action
export const fetchUserById = (key) => (dispatch) => {
  dispatch(request({ key }));
  return axios(`https://jsonplaceholder.typicode.com/users/${key}`)
    .then(({ data }) => dispatch(success({ data, key })))
    .catch(error => dispatch(failure({ error, key })))
}

// Selector
export const selectUserById = createSelector(
  state => state.keys,
  (state) => (key, path, defaultValue) => path ? get(state, `${key}.${path}`, defaultValue) : get(state, key, defaultState)
)

// Selector for useMemo
export const makeSelectUserById = () => selectUserById
```

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

```js
// src/App.js
import React from 'react';
import { Provider } from 'use-codex';
import { store } from './app/store';
import Post from './features/post/Post';
import User from './features/user/User';

const App = () => (
  <Provider store={store} features={['post', 'user']}>
    <Post userId={0} />
    <User userId={0} />
  </Provider>
);

export default App;
```

```js
// src/features/user/hooks/useUser.js
import { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'use-codex';
import { makeSelectUserById, fetchUserById } from '../../../app/user'

export const useUser = (userId) => {
  // Reducer
  const selectUserById = useMemo(makeSelectUserById, [])
  const user = useSelector('user', selectUserById)
  const dispatch = useDispatch('user')
  const userExpensive = useCallback(user, [user]);
  const refetch = useCallback((key) => fetchUserById(key)(dispatch), [dispatch])
  useEffect(() => {
    if(userId) {
      // ComponentDidUpdate
      refetch(userId);
    }
  }, [userId, refetch]); // shouldComponentUpdate
  return { user: userExpensive, refetch };
}
```

# API

## configureStore

## createSlice

## Provider

## useSelector

## useDispatch

## useConsumer

## createSelector

## useImmer

## useImmerReducer