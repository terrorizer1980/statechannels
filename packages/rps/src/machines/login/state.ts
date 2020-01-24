import {AnyAction} from './actions';
import {StateNodeConfig} from 'xstate';

type TContext = any;

export interface LoginState {
  loading: boolean;
  loggedIn: boolean;
  user: any;
  error: string | undefined;
}

// xstate
interface BooleanSchema {
  states: {
    true: any;
    false: any;
  };
}

interface LoadingSchema {
  states: {
    loading: any;
    loggedIn: any;
  };
}
const loading: StateNodeConfig<TContext, BooleanSchema, AnyAction> = {
  initial: 'false',
  states: {
    true: {on: {'LOGIN.SUCCESS': 'false'}},
    false: {on: {'LOGIN.REQUEST': 'true'}},
  },
};
const loggedIn: StateNodeConfig<TContext, BooleanSchema, AnyAction> = {
  initial: 'false',
  states: {
    true: {},
    false: {on: {'LOGIN.SUCCESS': 'true'}},
  },
};
export const login: StateNodeConfig<TContext, LoadingSchema, AnyAction> = {
  initial: 'loading',
  states: {
    loading,
    loggedIn,
  },
};
