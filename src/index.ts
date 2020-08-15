// My Library
import { useDispatch, useSelector, useConsumer, Provider, createSlice, configureStore } from './use-codex'

const Codex: any = {
  useDispatch, 
  useSelector, 
  useConsumer, 
  Provider,
  createSlice, 
  configureStore, 
}

export {
  useDispatch, 
  useSelector, 
  useConsumer, 
  Provider,
  createSlice, 
  configureStore, 
}

export { createSelector } from 'reselect';
export { useImmerReducer, useImmer } from 'use-immer';

export default Codex