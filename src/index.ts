// My Library
import { useDispatch, useSelector, useConsumer, Provider, createSlice, configureStore, querySlice } from './use-codex'

const Codex: any = {
  useDispatch, 
  useSelector, 
  useConsumer, 
  Provider,
  createSlice, 
  configureStore, 
  querySlice,
}

export { createSelector } from 'reselect';
export { useImmerReducer, useImmer } from 'use-immer';

export default Codex