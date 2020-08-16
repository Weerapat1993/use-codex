import * as React from 'react';
import { useSelector, useDispatch } from '../index'

export const connect = (mapStateToProps: Function, mapDispatchToProps: Function) => (WrapperComponent: React.FunctionComponent) => {
  const Connect = (props: any): JSX.Element => {
    const state = mapStateToProps && typeof mapStateToProps === 'function' ? mapStateToProps(useSelector, props) : {}
    const dispatch = mapDispatchToProps && typeof mapDispatchToProps === 'function' ? mapDispatchToProps(useDispatch, props) : {}
    return <WrapperComponent {...state} {...dispatch} {...props} />;
  }
  return Connect;
}