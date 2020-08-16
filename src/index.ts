// My Library
import { useDispatch, useSelector, useConsumer, Provider, configureStore, connect } from './components/FeatureContextProvider'
import { createSlice } from './createSlice'

const Codex: any = {
  useDispatch, 
  useSelector, 
  useConsumer, 
  Provider,
  createSlice, 
  configureStore,
  connect,
}

export {
  useDispatch, 
  useSelector, 
  useConsumer, 
  Provider,
  createSlice, 
  configureStore, 
  connect,
}

export { useImmerReducer, useImmer } from 'use-immer';

export default Codex